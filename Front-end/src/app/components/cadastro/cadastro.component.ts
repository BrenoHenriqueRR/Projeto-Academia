import { Component, EventEmitter, Output , Input, signal } from '@angular/core';
import { MenuHomeComponent } from '../menu-home/menu-home.component';
import { LoginComponent } from '../login/login.component';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { NgIf } from '@angular/common';



@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [MenuHomeComponent, LoginComponent, RouterLink, ReactiveFormsModule, NgIf],
  providers: [
    CadastroService
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  formcadastro!: FormGroup;
  @Output("enviar") onSubmit = new EventEmitter();
  loading = false;
  mensagemSucesso!: string;
  

  constructor(private service: CadastroService){
    this.formcadastro = new FormGroup({
     nome: new FormControl('', [Validators.required]),
     email: new FormControl('', [Validators.required, Validators.email]),
     senha: new FormControl('', [Validators.required]),
     endereco: new FormControl('', [Validators.required]),
    });
  }

  submit(){
    if (this.formcadastro.valid) {
      // Obter os valores do formulário e converter para JSON
      const dados = JSON.stringify(this.formcadastro.getRawValue());
  
      // Emitir evento onSubmit e definir loading como verdadeiro
      this.onSubmit.emit();
      this.loading = true;
  
      // Enviar os dados
      this.service.sendData(dados).subscribe({
          next: (resposta) => {
            this.mensagemSucesso = resposta.msg ;
            console.log(this.mensagemSucesso);
            this.formcadastro.reset();
            this.loading = false;
          }
        })
    }
  }

}

