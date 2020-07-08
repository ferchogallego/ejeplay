import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSliderComponent } from './update-slider.component';

describe('UpdateSliderComponent', () => {
  let component: UpdateSliderComponent;
  let fixture: ComponentFixture<UpdateSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
