import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateliveComponent } from './createlive.component';

describe('CreateliveComponent', () => {
  let component: CreateliveComponent;
  let fixture: ComponentFixture<CreateliveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateliveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateliveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
