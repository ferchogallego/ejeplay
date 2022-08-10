import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoPs5Component } from './catalogo-ps5.component';

describe('CatalogoPs5Component', () => {
  let component: CatalogoPs5Component;
  let fixture: ComponentFixture<CatalogoPs5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoPs5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoPs5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
