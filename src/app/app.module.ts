import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HiitTimerComponent } from './components/hiit-timer/hiit-timer.component';
import { HiitTimerFormComponent } from './components/hiit-timer-form/hiit-timer-form.component';
import { TimerLanguageSelectionComponent } from './components/timer-language-selection/timer-language-selection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DelayDirective } from './directives/delay.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    HiitTimerComponent,
    HiitTimerFormComponent,
    TimerLanguageSelectionComponent,
    DelayDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule, 
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
