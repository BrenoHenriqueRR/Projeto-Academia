import { Component, EventEmitter, Output } from '@angular/core';
import { MenuHomeComponent } from '../menu-home/menu-home.component';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MenuHomeComponent,RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  providers: [
    LoginService
  ],
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formlogin!: FormGroup;
  @Output("enviar") onSubmit = new EventEmitter();
  loading = false;
  mensagemSucesso!: string;
  

  constructor(private service: LoginService){
    this.formlogin = new FormGroup({
     email: new FormControl('', [Validators.required]),
     senha: new FormControl('', [Validators.required]),
    });
  }

  submit(){
    if (this.formlogin.valid) {
      // Obter os valores do formulário e converter para JSON
      const dados = JSON.stringify(this.formlogin.getRawValue());
  
      // Emitir evento onSubmit e definir loading como verdadeiro
      this.onSubmit.emit();
      this.loading = true;
  
      // Enviar os dados
      this.service.sendData(dados).subscribe({
          next: (resposta) => {
            this.mensagemSucesso = resposta.msg ;
            console.log(this.mensagemSucesso);
            this.formlogin.reset();
            this.loading = false;
          }
        })
    }
  }
}
