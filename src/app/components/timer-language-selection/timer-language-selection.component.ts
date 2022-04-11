import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, tap } from 'rxjs';

@Component({
  selector: 'app-timer-language-selection',
  templateUrl: './timer-language-selection.component.html',
  styleUrls: ['./timer-language-selection.component.css']
})
export class TimerLanguageSelectionComponent implements OnInit {

  @Input()
  selectedLanguageSubject$: Subject<any> | undefined

  lanuageForm: any;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.lanuageForm = this.fb.group({
      language: ['English', Validators.required],
    });

    this.lanuageForm.setValue({ language: localStorage.getItem("language") ? localStorage.getItem("language") : "English" })

    this.lanuageForm.get("language")
      .valueChanges
      .pipe(tap((value: string) => localStorage.setItem("language", value)))
      .subscribe(this.selectedLanguageSubject$)
  }

}
