import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fromEvent, map, Subject } from 'rxjs';
import { secondsToDhms } from '../secondToDhms';

@Component({
  selector: 'app-hiit-timer-form',
  templateUrl: './hiit-timer-form.component.html',
  styleUrls: ['./hiit-timer-form.component.css']
})
export class HiitTimerFormComponent implements OnInit {

  @ViewChild('submitButton', { read: ElementRef, static: true }) submitButton: ElementRef | undefined;

  @ViewChild('stopBtn', { read: ElementRef, static: true }) stopBtn: ElementRef | undefined;

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
        map(() => this.hiitForm.value))
      .subscribe(this.configSubject$)

  }

  public secondsToDhmsDupl(value: any) {
    return secondsToDhms(value)
  }

}
