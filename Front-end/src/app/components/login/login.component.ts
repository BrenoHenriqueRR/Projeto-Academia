import { Component, EventEmitter, Output } from '@angular/core';
import { MenuHomeComponent } from '../menu-home/menu-home.component';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MenuHomeComponent, RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  providers: [
    LoginService
  ],
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formlogin!: FormGroup;
  loading = false;
  mensagem!: string;
  clicado = false;
  email_cli !: string;


  constructor(private service: LoginService, private router: Router, private alertas: ToastrService) {
    if (localStorage.getItem('idcliente')) {
      this.logar();
    }
    this.formlogin = new FormGroup({
      email: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required]),
    });
  }

  submit() {
    this.clicado = true;
    if (this.formlogin.valid) {
      const dados = JSON.stringify(this.formlogin.getRawValue());
      // this.pesquisar(this.formlogin.value.email);

      this.loading = true;

      // Enviar os dados
      this.service.sendData(dados).subscribe({
        next: (resposta) => {
          this.mensagem = resposta[0].msg;
          console.log(resposta);
          const id = resposta[0].id;
          console.log(this.mensagem);
          this.formlogin.reset();
          if (this.mensagem == 'true') {
            setTimeout(() => {
              this.loading = false;
              localStorage.setItem("idcliente" , id);
              this.alertas.success("Seja Bem vindo !!");
              this.router.navigate(['/home-cliente']), {
              };
            }, 150);
          }else{
            this.loading = false;
            this.alertas.error("Dados Incorretos");
          }
        }, error: (err) => {
          this.alertas.error(err);
        },
      })
    } else {
      this.loading = false;
      alert("campos vazio!!")
    }
  }

  logar() {
    this.router.navigate(['/home-cliente']), {
    };
  }
}
