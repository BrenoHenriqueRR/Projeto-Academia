import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAnamneseComponent } from './modal-anamnese.component';

describe('ModalAnamneseComponent', () => {
  let component: ModalAnamneseComponent;
  let fixture: ComponentFixture<ModalAnamneseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAnamneseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalAnamneseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
