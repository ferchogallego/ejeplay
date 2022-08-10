import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallefisicosComponent } from './detallefisicos.component';

describe('DetallefisicosComponent', () => {
  let component: DetallefisicosComponent;
  let fixture: ComponentFixture<DetallefisicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallefisicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallefisicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
