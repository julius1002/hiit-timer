import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { interval, delay, map, take, scan, tap, Subject, switchMap, takeUntil, pairwise, filter, timer, withLatestFrom, pluck, BehaviorSubject, mergeMap, distinctUntilChanged, expand, of, startWith, skipUntil, auditTime, takeWhile, mergeWith } from 'rxjs';
import * as R from 'ramda'
import { translation } from "./translation"
import { secondsToDhms } from '../secondToDhms';

@Component({
  selector: 'app-hiit-timer',
  templateUrl: './hiit-timer.component.html',
  styleUrls: ['./hiit-timer.component.css']
})
export class HiitTimerComponent implements OnInit {

  @ViewChild('circle', { static: true }) circle: ElementRef | undefined;
  @ViewChild('arrow', { static: true }) arrow: ElementRef | undefined;
  @ViewChild('pointer', { static: true }) pointer: ElementRef | undefined;
  @ViewChild('timerBackground', { static: true }) timerBackground: ElementRef | undefined;

  timer$: Subject<any> = new BehaviorSubject(0);

  stopBtn$: Subject<any> = new Subject();

  pauseBtn$: Subject<any> = new Subject();

  pausedAt$ = new BehaviorSubject(0);

  configSubject$ = new Subject(); // consumer of the config produced by hiit form component

  selectedLanguageSubject$ = new BehaviorSubject(localStorage.getItem("language") ? localStorage.getItem("language") : "English");

  // speaker$ and translation functionality should be seperated into service
  speaker$ = new Subject();

  finishedWorkout$ = new Subject();

  //arrow animations
  private pointerBackGround = (color: string) => this.renderer.setStyle(this.timerBackground?.nativeElement, "background-color", `${color}`)
  private rotatePointer = (degree: number) => this.renderer.setStyle(this.pointer?.nativeElement, "transform", `rotate(${degree * 6}deg)`)

  private arrowAnimations: any = {
    "rotatePointer": this.rotatePointer,
    "setPointerBackgroundTo": this.pointerBackGround,
  }

  private exec(action: string) { return this.arrowAnimations[action] ? this.arrowAnimations[action] : () => console.log("no matching key") }

  constructor(private renderer: Renderer2) { }

  synth = window.speechSynthesis;

  message = new SpeechSynthesisUtterance();

  ngOnInit(): void {

    const languages: any = {
      "German": /apple/i.test(navigator.vendor) ? 3 : 0,
      "English": /apple/i.test(navigator.vendor) ? 6 : 1,
      "French": /apple/i.test(navigator.vendor) ? 15 : 4,
      "Spanish": /apple/i.test(navigator.vendor) ? 12 : 14
    }

    timer(10).pipe( // getVoices() need some Time to be initialized
      mergeMap(() => this.selectedLanguageSubject$),
    ).subscribe((message: any) => {
      this.message.voice = this.synth.getVoices()[languages[message]]
    })

    this.speaker$
      .pipe(
        withLatestFrom(this.selectedLanguageSubject$),
        map(([key, selectedLanguage]: any) => key.type ? translation[selectedLanguage][key.type](key.seconds) : translation[selectedLanguage][key])
      )
      .subscribe((msg: any) => {
        this.message.text = msg;
        window.speechSynthesis.speak(this.message)
      })

    this.configSubject$.subscribe((value: any) => {
      this.speaker$.next({ type: "Delay", seconds: value.initialDelay })
    })

    const resting$ = this.pauseBtn$
      .pipe(
        startWith(false),
        scan((acc, _) => !acc, true) //takes current state (true) and derives new state, through passed function
      )

    const hiit$ = (config: any) =>
      interval(100)
        .pipe(
          delay(config.initialDelay * 1000),
          takeUntil(this.stopBtn$),
          withLatestFrom(resting$), // another option is to use scan and collect all events that manipulate the state during a single stream (happens here too, but looks cleaner in scan)
          scan(({ pause, value, round, config }: any, [_, rest]) => {
            const newRound = Math.floor((value / 10) / (config.breakTime + config.duration))
            const pauseOver = ((value / 10) % (config.breakTime + config.duration)) === 0
            const startPause = Number.isInteger((value / 10) / (((round + 1) * config.duration) + (round * config.breakTime)))
            const newPause = (pause || startPause) && !pauseOver
            return { pause: newPause, value: rest ? value : R.add(1)(value), round: newRound, config: config }
          }, { pause: false, value: 0, round: 0, config: config }),
          map(({ value, ...state }: any) => ({ ...state, value: value / 10 })),
          distinctUntilChanged((prev, cur) => prev.value === cur.value),
        )

    this.stopBtn$.subscribe(() => {
      this.exec("setPointerBackgroundTo")("#0a599f")
      this.renderer.setStyle(this.pointer?.nativeElement, "transform", `rotate(${0 * 6}deg)`)
      this.pausedAt$.next(0)
      this.timer$.next(0)
    })

    this.configSubject$
      .pipe(
        switchMap((config) => hiit$(config)
          .pipe(
            takeWhile(({ value, config: { rounds, duration, breakTime } }) => value <= (rounds * duration + ((rounds - 1) * breakTime))),
            tap({
              next: ({ config: { breakTime, duration, initialDelay, rounds }, pause, round, value }) => {

                const roundTimerGreaterTen = duration > 10

                if ((value % (breakTime + duration) === (duration / 2)) && roundTimerGreaterTen) { this.speaker$.next("Halfway Through") }

                if (!pause && Number.isInteger((value + 3) / (((round + 1) * duration) + (round * breakTime))) && roundTimerGreaterTen) { this.speaker$.next("3") }
                if (!pause && Number.isInteger((value + 2) / (((round + 1) * duration) + (round * breakTime))) && roundTimerGreaterTen) { this.speaker$.next("2") }
                if (!pause && Number.isInteger((value + 1) / (((round + 1) * duration) + (round * breakTime))) && roundTimerGreaterTen) { this.speaker$.next("1") }

                if (pause) { this.exec("setPointerBackgroundTo")("green") } else { this.exec("setPointerBackgroundTo")("#0a599f") }

                this.exec("rotatePointer")(value)
              },
              complete: () => {
                this.speaker$.next("You are done")
              }
            }))
        )
      ).subscribe(this.timer$)

    // consumer when break/ breakover is comming
    this.timer$
      .pipe(
        pluck("pause"),
        pairwise(),
        map(([a, b]) => !a && b ? "Break" : a && !b ? "Break Over" : ""),
        filter(R.pipe(R.isEmpty, R.not))
      )
      .subscribe(this.speaker$)

  }

  secondsToDhmsDupl(value: any) {
    return secondsToDhms(value)
  }
}
