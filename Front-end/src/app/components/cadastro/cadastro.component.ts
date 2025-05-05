import { Component, EventEmitter, Output, Input, signal, ElementRef, HostListener } from '@angular/core';
import { MenuHomeComponent } from '../menu-home/menu-home.component';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { NgFor, NgIf } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ModalSpinnerComponent } from "../modais/modal-spinner/modal-spinner.component";
import { ConfigService } from '../../services/admin/config/config.service';
import { ButtonCheckedComponent } from "../button-checked/button-checked.component";
import { ToastrService } from 'ngx-toastr';
import { AnamneseService } from '../../services/admin/anamnese/anamnese.service';


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
  mostraSelectPersonal = false;
  menorDeIdade = false;
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
  anamneseForm!: FormGroup;
  IdCliAdm: string = "";
  fileName: string = 'Nenhum arquivo selecionado';
  foto: any;

  problemasSaude = [
    'Doença cardiaca coronariana',
    'Doença cardiaca reumática',
    'Doença cardiaca congênica',
    'Batimentos cardíacos irregulares',
    'Problemas nas válvulas cardíacas',
    'Murmúrios cardíacos',
    'Hipertensão',
    'Ataque cardíaco',
    'Epilepsia',
    'Diabetes',
    'Anguba',
    'Câncer'
  ];
  sintomasLista = [
    'Dor nas costas',
    'Dor nas articulações,tendões ou músculo',
    'Doença pulmonar(asma, enfisema, outra)'
  ];
  objetivos = [
    'Perder peso',
    'Melhorar aptidão fisica',
    'Melhorar flexibilidade',
    'Melhorar a condição muscular',
    'Reduzir as dores nas costas',
    'Reduzir o estresse',
    'Parar de fumar',
    'Diminuir colesterol',
    'Melhorar a nutruição',
    'Sentir-se melhor',
    'Outro (especifique)'
  ];



  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idPlano = params['id'];
      this.etapa = params['etapa'];
      this.cadAdm = params['cad'] || null;
      this.IdCliAdm = params['idCli'] || null;
    });

    this.adicionarCli();
    this.inicializarForm();
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
    this.personal();
  }

  constructor(private fb: FormBuilder,private alert: ToastrService , private service: CadastroService, 
    private router: Router, private planosService: ConfigService, private el: ElementRef, 
    private route: ActivatedRoute, private anamservice: AnamneseService) { }

  adicionarCli(){
    if(this.IdCliAdm){
      this.anamneseForm.get('cliente_id')?.setValue(this.IdCliAdm); 
    }
  }

  onCheckboxChange(event: any, classe: string) {
    const checkArray: FormArray = this.anamneseForm.get(classe) as FormArray;

    if (event.target.checked) {
      checkArray.push(this.fb.control(event.target.value));
    } else {
      const index = checkArray.controls.findIndex(x => x.value === event.target.value);
      checkArray.removeAt(index);
    }
  }

  onTextChange(event: any, classe: string) {
    const checkText: FormArray = this.anamneseForm.get(classe) as FormArray;

    if (event.target.value) {
      checkText.push(this.fb.control("descricao:" + event.target.value));
    } else {
      const index = checkText.controls.findIndex(x => x.value === event.target.value);
      checkText.removeAt(index);
    }
  }

  salvarAnamnese(): void {
    if (this.anamneseForm.valid) {
      let dados = this.anamneseForm.getRawValue()
      dados.perg_problemas_saude = dados.perg_problemas_saude.join(',');
      dados.perg_sintomas = dados.perg_sintomas.join(',');
      dados.perg_objetivos_saude = dados.perg_objetivos_saude.join(',');

      dados = JSON.stringify(dados);
      console.log(dados);
      this.anamservice.create(dados).subscribe({
        next: (dados) => {
          this.alert.success(dados.msg);
        }, error: (err) => {
          console.log(err);
          this.alert.error(err.msg);
        }
      })

    } else {
      this.alert.error('Preencha os campos obrigatórios!');
    }
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

  inicializarForm() {
    this.formcadastro = new FormGroup({
      foto_perfil: new FormControl(''),
      CPF: new FormControl('', [Validators.required]),
      RG: new FormControl('', [Validators.required]),
      nome: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      endereco: new FormControl('', [Validators.required]),
      datanascimento: new FormControl('', [Validators.required]),
      nivel_experiencia: new FormControl('iniciante', [Validators.required]),
      treino_com_personal: new FormControl(false),
      termo_responsabilidade: new FormControl(null),
      personal_id: new FormControl(''),
    });

    this.anamneseForm = this.fb.group({
      cliente_id: [null, Validators.required],
      perg_problemas_saude: this.fb.array([]),
      perg_sintomas: this.fb.array([]),
      perg_medicamentos: [''],
      perg_historico_familiar_cardiaco: [false],
      perg_restricao_medica: [],
      perg_gravida: [],
      perg_fuma: [],
      perg_bebe_alcool: [],
      perg_exercicio_frequente: [],
      perg_qtde_aerobico: [],
      perg_colesterol_medido: [],
      perg_alimentacao_balanceada: [],
      perg_gordura_alta: [],
      perg_nivel_estresse: ['leve', Validators.required],
      perg_objetivos_saude: this.fb.array([]),
      anotacoes: [],
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
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          } else {
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

  verificarIdade() {
    const hoje = new Date();
    let datacli = this.formcadastro.get("datanascimento")?.value;
    datacli = this.stringParaData(datacli);
    const nascimento = new Date(datacli);

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();

    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    this.menorDeIdade = idade < 18;

  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
      this.foto = input.files[0];
    } else {
      this.fileName = 'Nenhum arquivo selecionado';
    }
  }

  onPersonalToggle(event: any) {
    this.mostraSelectPersonal = event.target.checked;
    if (!this.mostraSelectPersonal) {
      this.formcadastro.get('personal_id')?.setValue(null);
    }
  }

  stringParaData(valor: string): Date {
    if (!valor || valor.length !== 8) return new Date('invalid');
    const dia = valor.substring(0, 2);
    const mes = valor.substring(2, 4);
    const ano = valor.substring(4, 8);
    return new Date(`${ano}-${mes}-${dia}`);
  }
}

