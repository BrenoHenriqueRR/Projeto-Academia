import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExibirComponent } from './modal-exibir.component';

describe('ModalExibirComponent', () => {
  let component: ModalExibirComponent;
  let fixture: ComponentFixture<ModalExibirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalExibirComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalExibirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
