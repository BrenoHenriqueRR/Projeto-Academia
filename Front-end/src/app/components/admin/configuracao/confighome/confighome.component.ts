import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../../services/admin/config/config.service';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ModalSpinnerComponent } from '../../../modal-spinner/modal-spinner.component';
import { PnFuncionarioService } from '../../../../services/admin/pn-funcionario/pn-funcionario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confighome',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass, ReactiveFormsModule, NgxMaskDirective, ModalSpinnerComponent, NgFor, ],
  templateUrl: './confighome.component.html',
  providers: [provideNgxMask()],
  styleUrl: './confighome.component.css'
})
export class ConfighomeComponent implements OnInit {

  showSpinner = true;
  currentStep: number = 1;
  planForm: FormGroup;
  cadForm: FormGroup;
  funcForm: FormGroup;
  fileName: string = 'Nenhum arquivo selecionado';
  logofile: any;
  msg!: any;
  loading: boolean = false;
  planos: any;
  funcionarios: any;
  novoBeneficio: string = ''; // Benefício atual que será adicionado
  beneficios: string[] = []; // Array para armazenar os benefícios

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    $event.returnValue = 'Você tem alterações não salvas! Tem certeza que deseja sair?';
  }

  ngOnInit() {
    this.loading = true;
    this.academiaservice.pesquisarPlanos().subscribe({
      next: (dado) => {
        this.planos = dado;
      }
    })
    this.funcservice.pesquisar().subscribe({
      next: (dado) => {
        this.funcionarios = dado;
      }
    })

    this.academiaservice.pesquisar().subscribe({
      next: (dado) => {
        if (dado == 0) {
          this.currentStep = 1;
          this.loading = true;
          setTimeout(() => {
            this.loading = false
          }, 1000);
        } else {
          this.currentStep = parseInt(dado[0].etapa_atual) + 1;
          if (this.currentStep == 5) {
            this.route.navigate(['/admin/painel'], {
              // queryParams: { user: 'admin'}
            });
          }
          this.loading = true;
          setTimeout(() => {
            this.loading = false
          }, 100);
        }
      }
    })
  }

  constructor(private fb: FormBuilder, private academiaservice: ConfigService,
    private alertas: ToastrService, private funcservice: PnFuncionarioService,
    private route: Router) {
    this.planForm = this.fb.group({
      nome: ['', Validators.required],
      preco: ['', Validators.required],
      // descontoPlano: ['', [Validators.required, Validators.min(1)]],
      descricao: ['', [Validators.required]],
      duracao: ['', [Validators.required]],
      beneficios: ['', [Validators.required]],
      disponibilidade: ['', [Validators.required]]
    });
    this.cadForm = this.fb.group({
      logo: ['', Validators.required],
      nomeAcad: ['', Validators.required],
      horarioFuncionamento: ['', Validators.required],
      telefoneAcademia: ['', Validators.required],
      emailAcademia: ['', [Validators.required, Validators.email]],
      descricaoAcad: ['', Validators.required],
      endereco: ['', Validators.required],
      cnpj: ['', Validators.required],
    });
    this.funcForm = this.fb.group({
      foto: ['', Validators.required],
      nome: ['', Validators.required],
      funcao: ['', Validators.required],
      telefone: ['', Validators.required],
      cpf: ['', Validators.required],
      data_nascimento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
  }

  adicionarBeneficio() {
    if (this.planForm.value.beneficios.trim()) {
      this.beneficios.push(this.planForm.value.beneficios.trim());
      this.planForm.value.beneficios = ''; // Limpa o campo textarea

      // Atualiza o campo 'beneficios' do formulário com todos os benefícios concatenados
      this.planForm.get('beneficios')?.setValue(this.beneficios.join(', '));
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
      this.logofile = input.files[0];
    } else {
      this.fileName = 'Nenhum arquivo selecionado';
    }
  }

  // #Cadastro da Academia# //
  salvarConfiguracoes() {
    if (this.cadForm.valid) {
      const formData = new FormData();
      formData.append('logo', this.logofile, this.logofile.name);
      formData.append('nomeAcad', this.cadForm.value.nomeAcad);
      // formData.append('horarioFuncionamento', this.cadForm.value.horarioFuncionamento);
      formData.append('telefoneAcademia', this.cadForm.value.telefoneAcademia);
      formData.append('emailAcademia', this.cadForm.value.emailAcademia);
      formData.append('descricaoAcad', this.cadForm.value.descricaoAcad);
      formData.append('endereco', this.cadForm.value.endereco);
      formData.append('cnpj', this.cadForm.value.cnpj);
      this.academiaservice.create(formData).subscribe({
        next: (dado) => {
          this.alertas.success(dado.msg);
          this.Proximo();
        }, error: (err) => {
          this.alertas.error("Ocorreu um Erro!");
          console.error(err);
        },
      })
    } else {
      this.alertas.error('Preencha os campos antes de salvar!!');
    }
  }
  // #### //

  //##Planos##//
  salvarConfiguracoesP() {
    const json = '{"etapa": "Planos"}';
    this.academiaservice.updateEtapa(json).subscribe({
      next: () => {
        this.ngOnInit();
      }
    })
  }

  salvarPlano() {
    if (this.planForm.valid) {
      const dados = JSON.stringify(this.planForm.getRawValue());
      this.academiaservice.createPlanos(dados).subscribe({
        next: (data) => {
          this.ngOnInit();
          this.planForm.reset();
          this.alertas.success("Plano inserido");
        }
      })

    } else {
      this.alertas.error("Campos Vazios !!");
    }
  }

  // #### //

  // #Passar etapas# //
  Proximo() {
    this.currentStep++;
    this.loading = true;
    setTimeout(() => {
      this.loading = false
    }, 100);
  }

  Anterior() {
    this.currentStep--;
  }
  // #### //

  // calcularValorFinal() { }

  //adicionarNovoPlano() {}


  // #Funcionarios# //
  salvarFuncionario() {
    if (this.funcForm.valid) {
      const formData = new FormData();
      formData.append('foto', this.logofile, this.logofile.name);
      formData.append('nome', this.funcForm.value.nome);
      formData.append('funcao', this.funcForm.value.funcao);
      formData.append('telefone', this.funcForm.value.telefone);
      formData.append('email', this.funcForm.value.email);
      formData.append('senha', this.funcForm.value.senha);
      formData.append('CPF', this.funcForm.value.cpf);
      formData.append('data_nascimento', this.funcForm.value.data_nascimento);
      this.funcservice.create(formData).subscribe({
        next: (dados) => {
          this.alertas.success(dados.msg);
          this.ngOnInit();
          this.funcForm.reset();
        }
      })
    } else {
      this.alertas.error("Campos Vazios !!");
    }
  }
  // #### //

  // # Etapa final # //
  finalEtapa() {
    this.alertas.success("Configurações Concluidas !");
    const json = '{"etapa": "Funcionario"}';
    this.academiaservice.updateEtapa(json).subscribe({
      next: () => {
        this.loading = true;
        setTimeout(() => {
          this.route.navigate(['/admin/painel'], {
            queryParams: { user: 'admin' }
          });
        }, 1500);
      }
    })
  }
}
