import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PnFuncionarioService } from '../../../services/admin/pn-funcionario/pn-funcionario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-cadastro',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './modal-cadastro.component.html',
  providers: [provideNgxMask()],
  styleUrl: './modal-cadastro.component.css'
})
export class ModalCadastroComponent {
  @Input() tipo!: string; // tipo do cadastro 
  @Output() CloseModal = new EventEmitter<void>();
  funcForm: FormGroup;
  fileName: string = 'Nenhum arquivo selecionado';
  foto: any;
  CliForm!: FormGroup<any>;


  constructor(private fb: FormBuilder, private funcservice: PnFuncionarioService,private alertas: ToastrService) {
    this.funcForm = this.fb.group({
      foto: ['', Validators.required],
      nome: ['', Validators.required],
      funcao: ['', Validators.required],
      telefone: ['', Validators.required],
      cpf: ['', Validators.required],
      data_nascimento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
    this.CliForm = this.fb.group({
      foto_perfil: ['', Validators.required],
      nome: ['', Validators.required],
      endereco: ['', Validators.required],
      telefone: ['', Validators.required],
      CPF: ['', Validators.required],
      data_nascimento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
  }

  submitForm() {
    if (this.tipo === 'funcionario') {
      if (this.funcForm.valid) {
        const formData = new FormData();
        formData.append('foto', this.foto, this.foto.name);
        formData.append('nome', this.funcForm.value.nome);
        formData.append('funcao', this.funcForm.value.funcao);
        formData.append('telefone', this.funcForm.value.telefone);
        formData.append('email', this.funcForm.value.email);
        formData.append('senha', this.funcForm.value.senha);
        formData.append('CPF', this.funcForm.value.cpf);
        formData.append('data_nascimento', this.funcForm.value.data_nascimento);
        this.funcservice.create(formData).subscribe({
          next: (dados) => {
            this.alertas.success(dados.msg);
            this.funcForm.reset();
            $('#exampleModal').modal('hide');
            this.CloseModal.emit();
          }
        })
      } else {
        this.alertas.error("Campos Vazios !!");
      }
    } else if (this.tipo === 'cliente') {

    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
      this.foto = input.files[0];
    } else {
      this.fileName = 'Nenhum arquivo selecionado';
    }
  }
}
