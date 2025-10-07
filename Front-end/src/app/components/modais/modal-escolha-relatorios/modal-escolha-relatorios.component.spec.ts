import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEscolhaRelatoriosComponent } from './modal-escolha-relatorios.component';

describe('ModalEscolhaRelatoriosComponent', () => {
  let component: ModalEscolhaRelatoriosComponent;
  let fixture: ComponentFixture<ModalEscolhaRelatoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEscolhaRelatoriosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalEscolhaRelatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
