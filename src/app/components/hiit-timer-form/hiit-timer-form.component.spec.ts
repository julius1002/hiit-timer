import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiitTimerFormComponent } from './hiit-timer-form.component';

describe('HiitTimerFormComponent', () => {
  let component: HiitTimerFormComponent;
  let fixture: ComponentFixture<HiitTimerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiitTimerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiitTimerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
