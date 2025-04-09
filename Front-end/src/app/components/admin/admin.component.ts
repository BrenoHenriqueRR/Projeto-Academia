import { NgIf, ɵnormalizeQueryParams } from '@angular/common';
import { Component, EventEmitter, Inject, Output, Query } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginAdminService } from '../../services/admin/login/login-admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-painel-admin',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
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
  func!: any;

  ngOnInit() {
    if (localStorage.getItem('idadmin')) {
      this.router.navigate(['/admin/painel']);
      
    }
    this.formlogin = new FormGroup({
      email: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required]),
    });
  }

  constructor(private service: LoginAdminService, @Inject(Router) public router: Router, private alertas: ToastrService) {
  }

  submit() {
    if (this.formlogin.invalid) {
      this.alertas.error("Preencha todos os campos corretamente!");
      return;
    }
  
    const loginData = this.formlogin.getRawValue();
    this.loading = true;
  
    this.service.sendData(JSON.stringify(loginData)).subscribe({
      next: (resposta) => {
        if (resposta?.msg === 'true') {
          this.func = loginData;
          this.pesquisar(this.func.email).then(() => {
            this.loading = false;
            this.router.navigate(['/admin/painel'], {
              queryParams: { user: this.func.email }
            });
          });
        } else {
          this.alertas.error("Dados Incorretos!");
        }
      },
      error: () => {
        this.loading = false;
        this.alertas.error("Erro ao realizar login. Tente novamente.");
      }
    });
  }
  

  // submit() {
  //  
  //   if (this.formlogin.valid) {
  //     const dados = JSON.stringify(this.formlogin.getRawValue());
  //     this.pesquisar(this.formlogin.value.email);
  //     this.func = this.formlogin.getRawValue();
  //     this.loading = true;
  //     this.service.sendData(dados).subscribe({
  //       next: (resposta) => {
  //         this.mensagem = resposta.msg;
  //         this.loading = false;
  //     
  //         if (this.mensagem == 'true') {
  //           this.router.navigate(['/admin/painel'], {
  //             queryParams: { user: this.func.email }
  //           });
  //         }else{
  //           this.alertas.error("Dados Incorretos !");
  //       
  //         }
  //       }, error: () => {
  //         this.loading = false;
  //     
  //         this.alertas.error("Erro ao realizar login. Tente novamente.");
  //       }
  //     })
  //   }else{
  //     this.alertas.error("Preencha Todos os Campos!!");
  // 
  //   }
  // };

  pesquisar(email: string): Promise<void> {
    const payload = { email };
  
    return new Promise((resolve, reject) => {
      this.service.funcao(JSON.stringify(payload)).subscribe({
        next: (dado) => {
          localStorage.setItem('idadmin', dado[0].id);
          resolve();
        },
        error: (err) => {
          this.alertas.warning("Erro ao buscar dados do admin");
          reject(err);
        }
      });
    });
  }

}


