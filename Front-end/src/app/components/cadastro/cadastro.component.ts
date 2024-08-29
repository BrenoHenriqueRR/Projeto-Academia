import { Component, EventEmitter, Output , Input, signal, ElementRef, HostListener } from '@angular/core';
import { MenuHomeComponent } from '../menu-home/menu-home.component';
import { LoginComponent } from '../login/login.component';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { NgFor, NgIf } from '@angular/common';
import { NgxMaskDirective, provideNgxMask  } from 'ngx-mask';
import { ModalSpinnerComponent } from "../modal-spinner/modal-spinner.component";
import { ConfigService } from '../../services/admin/config/config.service';


@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [MenuHomeComponent, LoginComponent, RouterLink, ReactiveFormsModule, NgIf,NgFor, NgxMaskDirective, ModalSpinnerComponent],
  providers: [
    CadastroService,
    provideNgxMask(),
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  formcadastro!: FormGroup;
  loading: boolean = false;
  mensagemSucesso!: string;
  Personal!: any;
  i = 0;
  etapa : number = 1;
  planos!: any;
  Vscroll: boolean = false;
  divPosition!: number;

  
  ngOnInit(){
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    },200);
    this.planosService.pesquisarPlanos().subscribe({
      next: (dado) =>{
        this.planos = dado;
        this.planos.sort((a: { preco: number; }, b: { preco: number; }) => a.preco - b.preco);
        this.loading = false;
      }
    })
  }

  ngAfterViewInit(): void {
    // Agora é seguro acessar o DOM
    const element = this.el.nativeElement.querySelector('.float-end');
    
    if (element) {
      this.divPosition = element.offsetTop;
    } else {
      console.error('Elemento não encontrado no DOM.');
    }
  }


  constructor(private service: CadastroService,private router: Router, private planosService: ConfigService,private el: ElementRef){
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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Verifica se o usuário rolou além da posição da div
    if (window.scrollY >= this.divPosition) {
      this.Vscroll = true;
    } else {
      this.Vscroll = false;
    }
  }

  submit(){
    if (this.formcadastro.valid) {
      // Obter os valores do formulário e converter para JSON
      const dados = JSON.stringify(this.formcadastro.getRawValue());

      console.log(dados);
        
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
    this.service.pesquisar().subscribe({
      next: (dado) => {
        // console.log('Dados recebidos:', dado);
        this.Personal = dado;
        
      },error: (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
  });
  }
}

