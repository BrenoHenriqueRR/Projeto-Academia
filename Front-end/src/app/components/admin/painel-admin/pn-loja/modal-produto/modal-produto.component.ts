import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PnLojaService } from '../../../../../services/admin/pn-loja/pn-loja.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-produto',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './modal-produto.component.html',
  styleUrl: './modal-produto.component.css'
})
export class ModalProdutoComponent {
  produtoForm!: FormGroup<any>;
  @Output() CloseModal = new EventEmitter<void>();

  ngOnInit() {
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      preco: ['',Validators.required],
      quantidade: ['',Validators.required],
      status: ['ativo',Validators.required]
    });
  }

  constructor(private fb: FormBuilder, private lojaservice: PnLojaService, private alertas: ToastrService) { }

  submit() {

    if(this.produtoForm.valid){
      const dados = JSON.stringify(this.produtoForm.getRawValue());

      this.lojaservice.createP(dados).subscribe({
        next: () => {
          this.alertas.success("Cadastro enviado com sucesso !!");
          this.produtoForm.reset();
          this.CloseModal.emit();
          ($('#modal-cad-p') as any).modal('hide');
        }, error: (er) => {
          this.alertas.error("Erro ao finalizar o cadastro");
          console.log(er);
        }
      })
    }else{
      this.alertas.error("Campos não inseridos")
    }
  }



}
