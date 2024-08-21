import { NgIf, ɵnormalizeQueryParams } from '@angular/common';
import { Component, EventEmitter, Inject, Output, Query } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginAdminService } from '../../services/admin/login/login-admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-painel-admin',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  providers: [
    LoginAdminService
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  formlogin!: FormGroup;
  loading = false;
  mensagem!: string;
  clicado = false;
  func!: any;

  ngOnInit() {
    if (localStorage.getItem('idadmin')) {
      this.router.navigate(['/admin/painel']);
    }
  }

  constructor(private service: LoginAdminService, @Inject(Router) public router: Router, private alertas: ToastrService) {
    this.formlogin = new FormGroup({
      email: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required]),
    });
  }

  submit() {
    this.clicado = true;
    if (this.formlogin.valid) {
      // Obter os valores do formulário e converter para JSON
      const dados = JSON.stringify(this.formlogin.getRawValue());
      this.pesquisar(this.formlogin.value.email);
      this.func = this.formlogin.getRawValue();
      this.loading = true;
      this.service.sendData(dados).subscribe({
        next: (resposta) => {
          this.mensagem = resposta.msg;
          this.loading = false;
          if (this.mensagem == 'true') {
            this.router.navigate(['/admin/painel'], {
              queryParams: { user: this.func.email }
            });
          }else{
            this.alertas.error("Dados Incorretos !");
          }
        }
      })
    }
  };

  pesquisar(email: any) {
    const jsonString: string = '{"email": "' + email + '"}';
    this.service.funcao(jsonString).subscribe({
      next: (dado) => {
        localStorage.setItem('idadmin', dado[0].id);

      }
    });
  }

}


