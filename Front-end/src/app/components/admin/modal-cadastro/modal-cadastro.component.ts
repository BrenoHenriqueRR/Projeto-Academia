import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-modal-cadastro',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule,NgxMaskDirective],
  templateUrl: './modal-cadastro.component.html',
  providers: [provideNgxMask()],
  styleUrl: './modal-cadastro.component.css'
})
export class ModalCadastroComponent {
  @Input() tipo!: string; // tipo do cadastro 
  funcForm!: FormGroup;
  fileName: string = 'Nenhum arquivo selecionado';
  foto: any;

  constructor(private fb: FormBuilder) {
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
  }

  submitForm() {
    if (this.tipo === 'funcionario') {
      if (this.funcForm.valid) {
        console.log(this.funcForm.getRawValue());
        $('#exampleModal').modal('hide');
      }else{
        console.log("dados nao preenchidos");
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
