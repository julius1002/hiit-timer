import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutTrackComponent } from './workout-track.component';

describe('WorkoutTrackComponent', () => {
  let component: WorkoutTrackComponent;
  let fixture: ComponentFixture<WorkoutTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutTrackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
