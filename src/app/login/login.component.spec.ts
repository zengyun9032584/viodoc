import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LonginComponent } from './longin.component';

describe('LonginComponent', () => {
  let component: LonginComponent;
  let fixture: ComponentFixture<LonginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LonginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LonginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
