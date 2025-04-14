import { Component, EventEmitter, Output, Input, signal, ElementRef, HostListener } from '@angular/core';
import { MenuHomeComponent } from '../menu-home/menu-home.component';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { NgFor, NgIf } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ModalSpinnerComponent } from "../modais/modal-spinner/modal-spinner.component";
import { ConfigService } from '../../services/admin/config/config.service';
import { ButtonCheckedComponent } from "../button-checked/button-checked.component";


@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, NgxMaskDirective, ModalSpinnerComponent, ButtonCheckedComponent],
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
  etapa: number = 1;
  planos!: any;
  extras!: any;
  Vscroll: boolean = false;
  divPosition!: number;
  idPlano!: number;
  total: number = 0;
  totalExtra: number = 0;
  extrasnome: Array<{ nome: string; preco: string }> = [];
  select_extras: Array<{ id: number, nome: string }> = [];
  cadAdm: string = "";



  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idPlano = params['id'];
      this.etapa = params['etapa'];
      this.cadAdm = params['cad'] || null;
    });
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 200);
    this.planosService.pesquisarPlanos().subscribe({
      next: (dado) => {
        for (let i = 0; i < dado.length; i++) {
          if (this.idPlano == dado[i].id) {
            this.planos = Array(dado[i]);
            this.loading = false;
            this.total = parseInt(dado[i].preco);
          }
        }
      }
    })
    this.planosService.pesquisarPlanosExtras().subscribe({
      next: (dado) => {
        this.extras = dado.map((extras: any) => {
          return { ...extras, checked: false };
        });
        this.loading = false;
      }
    })

    this.formcadastro = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required]),
      endereco: new FormControl('', [Validators.required]),
      datanascimento: new FormControl('', [Validators.required]),
      CPF: new FormControl('', [Validators.required]),
      personal_id: new FormControl('', [Validators.required]),
    });
  }

  constructor(private service: CadastroService, private router: Router, private planosService: ConfigService, private el: ElementRef, private route: ActivatedRoute) { }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Verifica se o usuário rolou além da posição da div
    if (window.scrollY >= this.divPosition) {
      this.Vscroll = true;
    } else {
      this.Vscroll = false;
    }
  }

  submit() {
    if (this.formcadastro.valid) {
      let dados = this.formcadastro.getRawValue();
      dados['extras'] = this.select_extras.map((extra: { id: number }) => extra.id);
      dados['plano'] = this.planos.map((plano: { id: number }) => plano.id);

      console.log(JSON.stringify(dados));
    } else {
      alert("campos vazio!!")
    }
  }
  personal() {
    this.service.pesquisar().subscribe({
      next: (dado) => {
        // console.log('Dados recebidos:', dado);
        this.Personal = dado;

      }, error: (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }

    });
  }

  onCheckedChange(checked: boolean, extra: any): void {
    this.loading = true;
    this.select_extras.push(extra);
    setTimeout(() => {
      extra.checked = checked;
      if (extra.checked) {

        this.extrasnome.push({ nome: extra.nome, preco: extra.preco });
        this.totalExtra += parseInt(extra.preco);
        this.total += parseInt(extra.preco);
      } else {
        this.extrasnome = this.extrasnome.filter(nome => nome.nome !== extra.nome);
        this.totalExtra -= parseInt(extra.preco);
        this.total -= parseInt(extra.preco);
      }
      this.loading = false;
    }, 600);
  }

  nextEtapa(etapa: any) {
    switch (etapa) {
      case "0":
        this.etapa--;
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { etapa: this.etapa },
          queryParamsHandling: 'merge'
        });
        break;
      case "1":
        this.loading = true;
        setTimeout(() => {
          if (this.cadAdm == "true") {
            this.etapa = 3;
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { etapa: this.etapa },
              queryParamsHandling: 'merge'
            });
            this.loading = false;
          }else{
            this.etapa++;
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { etapa: this.etapa },
              queryParamsHandling: 'merge'
            });
            this.loading = false;
          }
        }, 300);
        break;
      case "2":

        if (!this.formcadastro.valid) {
          alert("campos vazio!!");
          break;
        } else {
          this.submit();
          break;
          this.etapa++;
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { etapa: this.etapa },
            queryParamsHandling: 'merge'
          });
        }
        break;
      default:
        break;
    }
  }
}

