import { NgIf, ɵnormalizeQueryParams } from '@angular/common';
import { Component, EventEmitter, Inject, Output, Query } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginAdminService } from '../../services/admin/login/login-admin.service';

@Component({
  selector: 'app-painel-admin',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule,NgIf],
  providers: [
    LoginAdminService
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  formlogin!: FormGroup;
  @Output("enviar") onSubmit = new EventEmitter();
  loading = false;
  mensagem!: string;
  clicado = false;
  func! : any;

  constructor(private service: LoginAdminService, @Inject(Router) public router: Router){
    this.formlogin = new FormGroup({
     email: new FormControl('', [Validators.required]),
     senha: new FormControl('', [Validators.required]),
    }); 
  }

  submit(){
    this.clicado = true;
    if (this.formlogin.valid) {
      // Obter os valores do formulário e converter para JSON
      const dados = JSON.stringify(this.formlogin.getRawValue());
      this.func = this.formlogin.getRawValue();
  
  
      // Emitir evento onSubmit e definir loading como verdadeiro
      this.onSubmit.emit();
      this.loading = true;
  
      // Enviar os dados
      this.service.sendData(dados).subscribe({
          next: (resposta) => {
            this.mensagem = resposta.msg ;
            console.log(this.mensagem);
            this.formlogin.reset();
            this.loading = false;
          }
        })
    }
  }

  isLoading = false;
  logado() {
    const dados = JSON.stringify(this.formlogin.getRawValue());
    this.isLoading = true;
    
    this.router.navigate(['/admin/painel'], {
      queryParams: { user: this.func.email}
    });
  }
}


