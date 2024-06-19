import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.css'
})
export class RecuperarSenhaComponent {
  recuperarForm: FormGroup;
  showNewPasswordFields = false;

  constructor(private fb: FormBuilder) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmeSenha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmitEmail() {
    if (this.recuperarForm.get('email')?.valid) {
      // Simula a verificação do e-mail
      this.showNewPasswordFields = true;
    }
  }

  onSubmitNewSenha() {
    if (this.recuperarForm.valid && this.recuperarForm.get('newPassword')?.value === this.recuperarForm.get('confirmPassword')?.value) {
      // Aqui você pode adicionar a lógica para atualizar a senha
      console.log('Senha alterada com sucesso');
    }
  }
}
