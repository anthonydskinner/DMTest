import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDynamicMediaComponent } from './custom-dynamic-media.component';

describe('CustomDynamicMediaComponent', () => {
  let component: CustomDynamicMediaComponent;
  let fixture: ComponentFixture<CustomDynamicMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDynamicMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDynamicMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
