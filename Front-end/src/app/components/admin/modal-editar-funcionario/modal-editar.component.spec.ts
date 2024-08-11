import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarFuncionarioComponent } from './modal-editar.component';

describe('ModalEditarComponent', () => {
  let component: ModalEditarFuncionarioComponent;
  let fixture: ComponentFixture<ModalEditarFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarFuncionarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalEditarFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
