import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as R from 'ramda';
import { fromEvent, map, Subject } from 'rxjs';

@Component({
  selector: 'app-hiit-timer-form',
  templateUrl: './hiit-timer-form.component.html',
  styleUrls: ['./hiit-timer-form.component.css']
})
export class HiitTimerFormComponent implements OnInit {

  @ViewChild('submitButton', { static: true }) submitButton: ElementRef | undefined;

  @ViewChild('stopBtn', { static: true }) stopBtn: ElementRef | undefined;

  hiitForm: FormGroup;

  @Input()
  configSubject$: Subject<any> | undefined;

  @Input()
  stopBtn$: Subject<any> | undefined;

  constructor(private fb: FormBuilder) {
    this.hiitForm = this.fb.group({
      rounds: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      duration: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      initialDelay: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      breakTime: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    });
  }

  ngOnInit(): void {
    fromEvent(this.stopBtn!.nativeElement, "click")
      .subscribe(this.stopBtn$)
    const formValue = localStorage.getItem("hiitForm") ? JSON.parse(localStorage.getItem("hiitForm")!) : {
      rounds: 3,
      duration: 30,
      initialDelay: 10,
      breakTime: 30
    }

    this.hiitForm.setValue(formValue)

    this.hiitForm.valueChanges.subscribe(value => localStorage.setItem("hiitForm", JSON.stringify(value)))

    fromEvent(this.submitButton?.nativeElement, "click")
      .pipe(
        map(() => this.hiitForm.value)).subscribe(this.configSubject$)

  }
  secondsToDhms = (sec: any) => {

    const secondsOfADay = R.multiply(3600)(24)

    const days = (seconds: number) => seconds / secondsOfADay
    const hours = (seconds: number) => seconds % secondsOfADay / 3600
    const minutes = (seconds: number) => seconds % 3600 / 60
    const secs = (seconds: number) => seconds % 60

    const dDisplay = (d: number) => d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    const hDisplay = (h: number) => h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    const mDisplay = (m: number) => m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    const sDisplay = (s: number) => s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    const seconds = R.map(Number, [sec])[0]

    const d = R.pipe(days, Math.floor, dDisplay)(seconds)
    const h = R.pipe(hours, Math.floor, hDisplay)(seconds)
    const m = R.pipe(minutes, Math.floor, mDisplay)(seconds)
    const s = R.pipe(secs, Math.floor, sDisplay)(seconds)

    return R.reduce((a: string, b: string) => a + b, "", [d, h, m, s]);
  }
}
