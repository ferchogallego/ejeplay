import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegosPS4Component } from './juegos-ps4.component';

describe('JuegosPS4Component', () => {
  let component: JuegosPS4Component;
  let fixture: ComponentFixture<JuegosPS4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegosPS4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegosPS4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
