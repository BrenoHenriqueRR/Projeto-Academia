import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-modal-produto',
  standalone: true,
  imports: [ReactiveFormsModule,NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './modal-produto.component.html',
  styleUrl: './modal-produto.component.css'
})
export class ModalProdutoComponent {
  produtoForm!: FormGroup<any>;

  ngOnInit(){
    this.produtoForm = this.fb.group({
      nome : [''],
      preco: [''],
      quantidade: [''],
      status: ['']
    });
  }

  constructor(private fb: FormBuilder) {}


}
