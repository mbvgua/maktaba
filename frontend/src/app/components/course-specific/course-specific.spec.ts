import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSpecific } from './course-specific';

describe('CourseSpecific', () => {
  let component: CourseSpecific;
  let fixture: ComponentFixture<CourseSpecific>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseSpecific]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseSpecific);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
