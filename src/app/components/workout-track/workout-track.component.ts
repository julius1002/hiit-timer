import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { of } from 'ramda';
import { BehaviorSubject, fromEvent, map, mapTo, Subject, tap } from 'rxjs';

@Component({
  selector: 'app-workout-track',
  templateUrl: './workout-track.component.html',
  styleUrls: ['./workout-track.component.css']
})

export class WorkoutTrackComponent implements OnInit {

  @ViewChild('clearBtn', { read: ElementRef, static: true }) clearBtn: ElementRef | undefined;

  workouts$: BehaviorSubject<any> = new BehaviorSubject(localStorage.getItem("savedWorkouts") ? JSON.parse(localStorage.getItem("savedWorkouts")!) : []);

  @Input()
  finishedWorkout$: Subject<any> | undefined;
  constructor() { }

  ngOnInit(): void {

    this.workouts$.subscribe(console.log)
    const putWorkoutToLocalStorage = (workout: any) => localStorage.getItem("savedWorkouts") ?
      localStorage.setItem("savedWorkouts", JSON.stringify([...JSON.parse(localStorage.getItem("savedWorkouts")!), workout])) :
      localStorage.setItem("savedWorkouts", JSON.stringify([workout]))

    this.finishedWorkout$
      ?.pipe(
        map((config: any) => ({ ...config, date: Date.now() })),
        tap(putWorkoutToLocalStorage),
        map((config: any) => JSON.parse(localStorage.getItem("savedWorkouts")!)),
      )
      .subscribe(this.workouts$)

    fromEvent(this.clearBtn!.nativeElement, "click")
      .pipe(
        tap(console.log),
        tap(() => localStorage.removeItem("savedWorkouts")),
        map(() => [])
      ).subscribe(this.workouts$)
  }

}
