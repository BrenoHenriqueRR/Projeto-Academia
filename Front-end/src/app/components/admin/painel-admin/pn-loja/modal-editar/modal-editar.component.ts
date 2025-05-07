import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PnLojaService } from '../../../../../services/admin/pn-loja/pn-loja.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormatarService } from '../../../../../services/helpers/formatar/formatar.service';

@Component({
  selector: 'app-modal-editar-prod',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [provideNgxMask()],
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
      marca: ['', Validators.required],
      unidade_medida: ['', Validators.required],
      status: ['', Validators.required]
    });
  }


  constructor(private fb: FormBuilder, private lojaservice: PnLojaService,
    private alertas: ToastrService, private formatar: FormatarService) { }

  openModal(produto: any) {
    this.produtos = produto;
    this.produtoForm.setValue({
      id: this.produtos.id,
      nome: this.produtos.nome,
      preco: this.produtos.preco,
      quantidade: this.produtos.quantidade,
      status: this.produtos.status,
      marca: this.produtos.marca,
      unidade_medida: this.produtos.unidade_medida

    });
    ($(this.modal?.nativeElement) as any).modal('show');
  }

  submit() {

    if (this.produtoForm.valid) {
      this.produtoForm.patchValue({
        preco: this.formatar.formatarPreco(this.produtoForm.value.preco),
      }); const dados = JSON.stringify(this.produtoForm.getRawValue());

      this.lojaservice.editarP(dados).subscribe({
        next: () => {
          this.alertas.success("Produto editado com sucesso !!");
          this.produtoForm.reset();
          this.CloseModal.emit();
          ($('#modal-edit-p') as any).modal('hide');
        }, error: (er) => {
          this.alertas.error("Erro ao editar");
          console.log(er);
        }
      })
    } else {
      this.alertas.error("Campos não inseridos")
    }
  }

  onPrecoInput(event: any): void {
    let valor = event.target.value;

    // Remove tudo que não for número ou vírgula
    valor = valor.replace(/[^\d,]/g, '');

    // Garante que só tenha uma vírgula
    const partes = valor.split(',');
    if (partes.length > 2) {
      valor = partes[0] + ',' + partes[1]; // ignora outras vírgulas
    }

    // Formata milhar (antes da vírgula)
    let [inteiro, decimal] = valor.split(',');
    inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const formatado = decimal !== undefined ? `${inteiro},${decimal}` : inteiro;

    this.produtoForm.get('preco')?.setValue(formatado, { emitEvent: false });
  }

}
