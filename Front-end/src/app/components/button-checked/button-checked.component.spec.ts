import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonCheckedComponent } from './button-checked.component';

describe('ButtonCheckedComponent', () => {
  let component: ButtonCheckedComponent;
  let fixture: ComponentFixture<ButtonCheckedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonCheckedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonCheckedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
