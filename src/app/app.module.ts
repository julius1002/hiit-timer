import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HiitTimerComponent } from './components/hiit-timer/hiit-timer.component';
import { HiitTimerFormComponent } from './components/hiit-timer-form/hiit-timer-form.component';
import { TimerLanguageSelectionComponent } from './components/timer-language-selection/timer-language-selection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HiitTimerComponent,
    HiitTimerFormComponent,
    TimerLanguageSelectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
