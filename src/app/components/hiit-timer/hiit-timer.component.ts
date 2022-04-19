import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { interval, delay, map, take, scan, tap, Subject, switchMap, takeUntil, pairwise, filter, timer, withLatestFrom, pluck, BehaviorSubject, mergeMap, distinctUntilChanged } from 'rxjs';
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

  timer$: Subject<any> = new Subject();

  stopBtn$: Subject<any> = new Subject();

  configSubject$ = new Subject(); // consumer of the config produced by hiit form component

  selectedLanguageSubject$ = new BehaviorSubject(localStorage.getItem("language") ? localStorage.getItem("language") : "English");

  // speaker$ and translation functionality should be seperated into service
  speaker$ = new Subject();

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
      // this.synth.getVoices().map(value => value.lang).forEach(console.log) for debugging languages on IOS
      this.message.voice =
        this.synth.getVoices()[languages[message]]
    })

    this.speaker$
      .pipe(
        withLatestFrom(this.selectedLanguageSubject$),
        map((value: any) => {
          const key = value[0]
          const delayEvent = value[0].type;
          const language = value[1]
          return delayEvent ? translation[language][delayEvent](key.seconds) : translation[language][key];
        })
      )
      .subscribe((msg: any) => {
        this.message.text = msg;
        window.speechSynthesis.speak(this.message)
      })

    // sum up elements [1,2,3,4] (range(1,5))
    const sum = (input: number) => R.reduce(((a: number, b: number) => a + b), 0)(R.range(1, input))

    //playing around with rambda
  /*  console.log(R.range(1, 5))
    console.log(R.zipWith((a, b: any) => a + b)(R.range(1, 5), R.range(1, 5)))
    console.log(sum(5)) */

    const everyTenth: (a: number) => number
      = (n: number) => n / 10;

    this.configSubject$.subscribe((value: any) => {
      this.speaker$.next({ type: "Delay", seconds: value.initialDelay })
    })

    const hiit$ = (config: any) => interval(100)
      .pipe(
        delay(config.initialDelay * 1000),
        takeUntil(this.stopBtn$),
        map(everyTenth),
        take((((config.rounds * config.duration) + ((config.rounds - 1) * config.breakTime)) * 10)),
        scan((acc: any, curr: number) => {
          const round = Math.floor(curr / (config.breakTime + config.duration))
          const pauseOver = (curr % (config.breakTime + config.duration)) === 0
          const startPause = Number.isInteger(curr / (((round + 1) * config.duration) + (round * config.breakTime)))
          const pause = (acc.pause || startPause) && !pauseOver
          return { pause: pause, value: curr, round: round, config: config }
        }))

    // fromEvent(this.startBtn?.nativeElement, "click")
    this.configSubject$
      .pipe(
        switchMap((config) => hiit$(config)))
      .subscribe(this.timer$)

    this.timer$
      .pipe(
        withLatestFrom(this.configSubject$) // first element of array is value, second is config
      )
      .subscribe((arr: any) => {

        // todo refactor with map see this.exec()


        //console.log((arr[0].value * 2)

        const roundTimerGreaterTen = (roundTime: number) => roundTime > 10

        if ((arr[0].value % (arr[1].breakTime + arr[1].duration) === (arr[1].duration / 2)) && roundTimerGreaterTen(arr[1].duration)) {
          this.speaker$.next("Halfway Through")
        }

        if (!arr[0].pause && Number.isInteger((arr[0].value + 3) / (((arr[0].round + 1) * arr[1].duration) + (arr[0].round * arr[1].breakTime))) && roundTimerGreaterTen(arr[1].duration)) {
          this.speaker$.next("3")
        }

        if (!arr[0].pause && Number.isInteger((arr[0].value + 2) / (((arr[0].round + 1) * arr[1].duration) + (arr[0].round * arr[1].breakTime))) && roundTimerGreaterTen(arr[1].duration)) {
          this.speaker$.next("2")
        }

        if (!arr[0].pause && Number.isInteger((arr[0].value + 1) / (((arr[0].round + 1) * arr[1].duration) + (arr[0].round * arr[1].breakTime))) && roundTimerGreaterTen(arr[1].duration)) {
          this.speaker$.next("1")
        }

        this.exec("rotatePointer")(arr[0].value)
        if (arr[0].pause) {
          this.exec("setPointerBackgroundTo")("green")
        } else {
          this.exec("setPointerBackgroundTo")("#0a599f")
        }
      }
      )

    // consumer is notifi ed when break is over. This happes when a true follows a false with pairwise
    /*  this.timer$
        .pipe(
          pluck("pause"),
          pairwise(),
          map(([a, b]) => a && !b),
          filter(Boolean))
        .subscribe(() => this.speaker$.next("Break Over"))*/

    // consumer when break is comming
    this.timer$
      .pipe(
        //filter(value => value.config?.breakTime > 5),
        pluck("pause"),
        pairwise(),
        map(([a, b]) => !a && b ? "Break" : a && !b ? "Break Over" : ""),
        filter(R.pipe(R.isEmpty, R.not))
      )
      .subscribe(this.speaker$)

    //this.speaker$.subscribe(console.log) speaker debug

    this.timer$
      .pipe(
        withLatestFrom(this.configSubject$), // first element of array is value, second is config
        filter((value: any) => (value[0].round == (value[1].rounds - 1)) && (value[0].value % (value[1].breakTime + value[1].duration)) === 0),
        tap((value: any) => {
          this.speaker$.next("Last Round")
        }),
        switchMap((value: any) => timer(value[1].duration * 1000).pipe(takeUntil(this.stopBtn$))),
      )
      .subscribe(() => this.speaker$.next("You are done"))
  }

  public secondsToDhmsDupl(value: any) {
    return secondsToDhms(value)
  }
}
