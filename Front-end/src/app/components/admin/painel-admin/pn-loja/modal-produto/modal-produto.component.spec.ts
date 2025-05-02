import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProdutoComponent } from './modal-produto.component';

describe('ModalProdutoComponent', () => {
  let component: ModalProdutoComponent;
  let fixture: ComponentFixture<ModalProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalProdutoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
