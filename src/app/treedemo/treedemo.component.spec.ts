import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreedemoComponent } from './treedemo.component';

describe('TreedemoComponent', () => {
  let component: TreedemoComponent;
  let fixture: ComponentFixture<TreedemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreedemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreedemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
