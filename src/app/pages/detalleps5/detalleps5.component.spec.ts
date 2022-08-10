import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Detalleps5Component } from './detalleps5.component';

describe('Detalleps5Component', () => {
  let component: Detalleps5Component;
  let fixture: ComponentFixture<Detalleps5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Detalleps5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Detalleps5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
