import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerLanguageSelectionComponent } from './timer-language-selection.component';

describe('TimerLanguageSelectionComponent', () => {
  let component: TimerLanguageSelectionComponent;
  let fixture: ComponentFixture<TimerLanguageSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerLanguageSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerLanguageSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
