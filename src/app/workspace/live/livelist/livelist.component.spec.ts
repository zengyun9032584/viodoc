import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivelistComponent } from './livelist.component';

describe('LivelistComponent', () => {
  let component: LivelistComponent;
  let fixture: ComponentFixture<LivelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
