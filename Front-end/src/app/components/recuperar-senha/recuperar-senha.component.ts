import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecuperarSenhaService } from '../../services/recuperar-senha/recuperar-senha.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.css'
})
export class RecuperarSenhaComponent {
  recuperarForm: FormGroup;
  step: number = 1;  // 1: Email, 2: Code, 3: New Password
  codsenha!: any;
  loading = false;

  constructor(private fb: FormBuilder, private service: RecuperarSenhaService, private router: Router) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      codsenha: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmeSenha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmitEmail() {
    if (this.recuperarForm.get('email')?.valid) {
      const dados = JSON.stringify(this.recuperarForm.getRawValue());
      this.loading = true;
      this.service.enviarMail(dados).subscribe({
        next: (data) => {
          this.loading = false;
          this.codsenha = data.senha;
          console.log(data);
          if (data.msg == 'Email enviado com sucesso') {
            this.step = 2;
          }
        }
      })
    }
  }

  onSubmitcodSenha() {
    if (this.recuperarForm.get('codsenha')?.valid) {
      if (this.recuperarForm.get('codsenha')?.value == this.codsenha) {
        this.step = 3;
      }
    }
  }

  onSubmitNewSenha() {
    if (this.recuperarForm.valid) {
      if (this.recuperarForm.get('senha')?.value === this.recuperarForm.get('confirmeSenha')?.value) {
        const dados = JSON.stringify(this.recuperarForm.getRawValue());
        // Aqui você pode adicionar a lógica para atualizar a senha
        this.service.trocarSenha(dados).subscribe({
          next: (dados) => {
            alert(dados.msg);
            this.router.navigate(['/login']), {
            };
          }
        })
      } else {
        alert('senhas diferentes,digite novamente!');
      }
    }else{
      alert('Digite uma senha de no minimo 6 digitos');
    }
  }

}
