import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoFisicoComponent } from './catalogo-fisico.component';

describe('CatalogoFisicoComponent', () => {
  let component: CatalogoFisicoComponent;
  let fixture: ComponentFixture<CatalogoFisicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoFisicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoFisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
