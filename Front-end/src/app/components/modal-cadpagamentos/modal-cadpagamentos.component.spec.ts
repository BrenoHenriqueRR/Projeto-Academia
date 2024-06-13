import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCadpagamentosComponent } from './modal-cadpagamentos.component';

describe('ModalCadpagamentosComponent', () => {
  let component: ModalCadpagamentosComponent;
  let fixture: ComponentFixture<ModalCadpagamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCadpagamentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalCadpagamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
