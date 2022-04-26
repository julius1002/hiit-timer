import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as R from 'ramda';
import { BehaviorSubject, debounce, debounceTime, filter, from, fromEvent, map, mapTo, of, scan, share, Subject, switchMap, take, takeWhile, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-workout-track',
  templateUrl: './workout-track.component.html',
  styleUrls: ['./workout-track.component.css']
})

export class WorkoutTrackComponent implements OnInit {

  @ViewChild('clearBtn', { read: ElementRef, static: true }) clearBtn: ElementRef | undefined;

  workouts$: BehaviorSubject<any>;

  @Input()
  finishedWorkout$: Subject<any> | undefined;

  constructor() {
    this.workouts$ = new BehaviorSubject(localStorage.getItem("savedWorkouts") ?
      R.take(5, JSON.parse(localStorage.getItem("savedWorkouts")!)) : [])
  }

  ngOnInit(): void {
    const putWorkoutToLocalStorage = (workout: any) => localStorage.getItem("savedWorkouts") ?
      localStorage.setItem("savedWorkouts", JSON.stringify([workout, ...JSON.parse(localStorage.getItem("savedWorkouts")!)])) :
      localStorage.setItem("savedWorkouts", JSON.stringify([workout]))

    // new workout finished
    this.finishedWorkout$?.pipe(
      map((config: any) => ({ ...config, date: Date.now() })),
      tap(putWorkoutToLocalStorage),
      map((_: any) => R.take(5, JSON.parse(localStorage.getItem("savedWorkouts")!))),
    )
      .subscribe(this.workouts$)

    const scrollToBottomPred = ({ deltaY }: any) => deltaY >= 0

    // scrolling to see more of history
    fromEvent(window, "mousewheel")
      .pipe(
        map(scrollToBottomPred),
        filter(Boolean),
        throttleTime(1500),
        scan((acc: any, _) => acc += 5, 5),
        map((size) => R.take(size, localStorage.getItem("savedWorkouts") ? JSON.parse(localStorage.getItem("savedWorkouts")!) : []))
      )
      .subscribe(this.workouts$)

    // clearing history
    fromEvent(this.clearBtn!.nativeElement, "click")
      .pipe(
        filter(() => confirm("Do you want to clear your workout history?")),
        tap(() => localStorage.removeItem("savedWorkouts")),
        map(() => [])
      ).subscribe(this.workouts$)
  }
}
