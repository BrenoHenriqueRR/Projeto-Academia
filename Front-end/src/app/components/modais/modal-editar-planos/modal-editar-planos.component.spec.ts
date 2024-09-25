import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarPlanosComponent } from './modal-editar-planos.component';

describe('ModalEditarPlanosComponent', () => {
  let component: ModalEditarPlanosComponent;
  let fixture: ComponentFixture<ModalEditarPlanosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarPlanosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalEditarPlanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
