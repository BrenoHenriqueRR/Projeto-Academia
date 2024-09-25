import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFaceidComponent } from './modal-faceid.component';

describe('ModalFaceidComponent', () => {
  let component: ModalFaceidComponent;
  let fixture: ComponentFixture<ModalFaceidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFaceidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFaceidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
