import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsePayuComponent } from './response-payu.component';

describe('ResponsePayuComponent', () => {
  let component: ResponsePayuComponent;
  let fixture: ComponentFixture<ResponsePayuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsePayuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsePayuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
