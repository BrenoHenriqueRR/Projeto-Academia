import { Component, EventEmitter, Output , Input, signal } from '@angular/core';
import { MenuHomeComponent } from '../menu-home/menu-home.component';
import { LoginComponent } from '../login/login.component';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { NgIf } from '@angular/common';
import { NgxMaskDirective, provideNgxMask  } from 'ngx-mask';


@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [MenuHomeComponent, LoginComponent, RouterLink, ReactiveFormsModule, NgIf,NgxMaskDirective],
  providers: [
    CadastroService,
    provideNgxMask(),
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
[x: string]: any;
  formcadastro!: FormGroup;
  @Output("enviar") onSubmit = new EventEmitter();
  loading = false;
  mensagemSucesso!: string;
  Personal!: any;
  i = 0;
  
  constructor(private service: CadastroService,private router: Router){
    this.formcadastro = new FormGroup({
     nome: new FormControl('', [Validators.required]),
     email: new FormControl('', [Validators.required, Validators.email]),
     senha: new FormControl('', [Validators.required]),
     endereco: new FormControl('', [Validators.required]),
     datanascimento: new FormControl('', [Validators.required]),
     CPF: new FormControl('', [Validators.required]),
     personal_id: new FormControl('', [Validators.required] ),
     frequencia: new FormControl('', [Validators.required] ),
    });
  }

  submit(){
    if (this.formcadastro.valid) {
      // Obter os valores do formulário e converter para JSON
      const dados = JSON.stringify(this.formcadastro.getRawValue());

      console.log(dados);
        
      // Emitir evento onSubmit e definir loading como verdadeiro
      this.onSubmit.emit();
      this.loading = true;
      // console.log (dados);
  
      // Enviar os dados
      this.service.sendData(dados).subscribe({
          next: (resposta) => {
            this.mensagemSucesso = resposta.msg ;
            console.log(this.mensagemSucesso);
            this.formcadastro.reset();
            this.loading = false;
            alert("Cadastro enviado com sucesso !!")
            this.router.navigate(['/login']),{
            };
          }
        })
      }else{
        alert("campos vazio!!")
      }
  }
  personal(){
    this.service.pesquisar().subscribe(
      (dado) => {
        // console.log('Dados recebidos:', dado);
        this.Personal = dado;
        
      },
      (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }

}

