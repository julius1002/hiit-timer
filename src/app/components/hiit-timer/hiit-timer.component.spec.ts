import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiitTimerComponent } from './hiit-timer.component';

describe('HiitTimerComponent', () => {
  let component: HiitTimerComponent;
  let fixture: ComponentFixture<HiitTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiitTimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiitTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
