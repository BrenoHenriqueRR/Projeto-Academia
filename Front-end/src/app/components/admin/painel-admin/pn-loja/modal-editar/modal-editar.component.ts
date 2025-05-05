import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PnLojaService } from '../../../../../services/admin/pn-loja/pn-loja.service';

@Component({
  selector: 'app-modal-editar-prod',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-editar.component.html',
  styleUrl: './modal-editar.component.css'
})
export class ModalEditarComponent {
  produtoForm!: FormGroup<any>;
  produtos!: any;
  @ViewChild('modal') modal?: ElementRef
  @Output() CloseModal = new EventEmitter<void>();

  ngOnInit() {
    this.produtoForm = this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      preco: ['', Validators.required],
      quantidade: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  openModal(produto: any){
    this.produtos = produto;
    this.produtoForm.setValue({
      id: this.produtos.id,
      nome: this.produtos.nome,
      preco: this.produtos.preco,
      quantidade: this.produtos.quantidade,
      status: this.produtos.status
    });  
    ($(this.modal?.nativeElement) as any).modal('show');
  }

  constructor(private fb: FormBuilder, private lojaservice: PnLojaService, private alertas: ToastrService) { }

  submit() {

    if (this.produtoForm.valid) {
      const dados = JSON.stringify(this.produtoForm.getRawValue());

      this.lojaservice.editarP(dados).subscribe({
        next: () => {
          this.alertas.success("Produto editado com sucesso !!");
          this.produtoForm.reset();
          this.CloseModal.emit();
         ( $('#modal-edit-p') as any).modal('hide');
        }, error: (er) => {
          this.alertas.error("Erro ao editar");
          console.log(er);
        }
      })
    } else {
      this.alertas.error("Campos não inseridos")
    }
  }

}
