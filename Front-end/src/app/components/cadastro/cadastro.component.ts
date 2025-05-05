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
import { error } from 'jquery';


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
      this.cadAdm = params['cad'] || null;
      this.IdCliAdm = params['idCli'] || null;
      this.etapa = params['etapa'] || 1;
    });

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

    this.route.queryParamMap.subscribe(params => {
      const etapaUrl = Number(params.get('etapa') || '1');
      if (etapaUrl > 1 && !this.etapaConcluida(etapaUrl - 1)) {
        this.alert.warning("Complete as etapas anteriores primeiro.");
        this.router.navigate([], { queryParams: { etapa: 1 }, queryParamsHandling: 'merge' });
      } else {
        this.etapa = etapaUrl;
      }
    });
  }

  constructor(private fb: FormBuilder, private alert: ToastrService, private service: CadastroService,
    private router: Router, private planosService: ConfigService, private el: ElementRef,
    private route: ActivatedRoute, private anamservice: AnamneseService) { }

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


  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Verifica se o usuário rolou além da posição da div
    if (window.scrollY >= this.divPosition) {
      this.Vscroll = true;
    } else {
      this.Vscroll = false;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.preventDefault();
    $event.returnValue = 'Tem certeza que deseja sair? As alterações não salvas serão perdidas.';
  }

  submit() {
    if (this.formcadastro.valid && this.anamneseForm.valid) {
      // Dados do cliente
      let dadosCli = this.formcadastro.getRawValue();
      let dadosAnamnese = this.anamneseForm.getRawValue();

      console.log(JSON.stringify(dadosAnamnese));
      console.log(JSON.stringify(dadosCli));

      dadosCli['extras'] = this.select_extras.map((extra: { id: number }) => extra.id);
      dadosCli['plano'] = this.planos.map((plano: { id: number }) => plano.id);

      dadosAnamnese.perg_problemas_saude = dadosAnamnese.perg_problemas_saude.join(',');
      dadosAnamnese.perg_sintomas = dadosAnamnese.perg_sintomas.join(',');
      dadosAnamnese.perg_objetivos_saude = dadosAnamnese.perg_objetivos_saude.join(',');


      // Junta tudo
      const formData = new FormData();
      formData.append('cliente', JSON.stringify(dadosCli));
      formData.append('anamnese', JSON.stringify(dadosAnamnese));
      formData.append('foto_perfil', this.foto);

      console.log(formData);



      this.service.createComplete(formData).subscribe({
        next: (resp) => {

        }, error: (err) => {
        }
      })



    } else {
      this.alert.error('Preencha todos os campos obrigatórios!');
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
          this.etapa++;
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { etapa: this.etapa },
            queryParamsHandling: 'merge'
          });
          this.loading = false;
        }, 300);
        break;
      case "2":
        this.loading = true;
        if (!this.formcadastro.valid) {
          this.alert.warning("Preencha todos os campos obrigatórios do cadastro.");
          this.loading = false;
          break;
        } else {
          setTimeout(() => {
            this.etapa++;
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { etapa: this.etapa },
              queryParamsHandling: 'merge'
            });
            this.loading = false;
          }, 300);
        }
        break;
      case "3": // Enviar anamnese
        if (!this.anamneseForm.valid) {
          this.alert.warning("Preencha a anamnese corretamente.");
          break;
        }
        this.submit();
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

  etapaConcluida(etapa: number): boolean {
    switch (etapa) {
      case 2:
        return this.formcadastro?.valid;
      case 3:
        return this.anamneseForm?.valid;
      default:
        return true;
    }
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

