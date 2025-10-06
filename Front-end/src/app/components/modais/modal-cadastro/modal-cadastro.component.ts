import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PnFuncionarioService } from '../../../services/admin/pn-funcionario/pn-funcionario.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../../../services/admin/config/config.service';
import { CadastroService } from '../../../services/cadastro.service';
import { Route, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ModalSpinnerComponent } from '../modal-spinner/modal-spinner.component';

@Component({
  selector: 'app-modal-cadastro',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule, NgxMaskDirective, CommonModule, ModalSpinnerComponent],
  templateUrl: './modal-cadastro.component.html',
  providers: [provideNgxMask({
    dropSpecialCharacters: false
  })],
  styleUrl: './modal-cadastro.component.css'
})
export class ModalCadastroComponent {

  @ViewChild('modal') modal?: ElementRef
  @Input() tipo: string = '' ; // tipo do cadastro 
  @Output() CloseModal = new EventEmitter<void>();
  loading = false;
  // Formulários
  CliForm!: FormGroup<any>;
  funcForm!: FormGroup;
  planoForm!: FormGroup<any>;
  extraForm!: FormGroup<any>;
  fileName: string = 'Nenhum arquivo selecionado';
  fileNames: { [key: string]: string } = {};
  atestadoMedico!: File;
  termoAutorizacao!: File;
  termoResponsabilidade!: File
  foto: any;
  planos: any;
  novoBeneficio: string = '';
  Personal!: any;
  beneficios: string[] = [];
  foto_cli!: File
  mostraSelectPersonal = false;
  menorDeIdade = false;
  option_frequencia = [2,3,7];

  ngOnInit() {
    this.inicializarForm();
    
    console.log(this.tipo);

    this.academiaservice.pesquisarPlanos().subscribe({
      next: (dado) => {
        this.planos = dado;
      }
    });

    this.cliservice.pesquisar().subscribe({
      next: (dado) => {
        // console.log('Dados recebidos:', dado);
        this.Personal = dado;

      }, error: (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    });
  }

  constructor(private fb: FormBuilder, private funcservice: PnFuncionarioService, private alertas: ToastrService,
    private academiaservice: ConfigService, private cliservice: CadastroService, private router: Router) { }

  mostrarErro(mensagem: string) {
 Swal.fire({
    icon: 'error',
    title: 'Ops!',
    text: mensagem || 'Ocorreu um erro inesperado.',
    confirmButtonText: 'Fechar',
    confirmButtonColor: '#d33',
    background: '#fff',
    customClass: {
      popup: 'animated fadeInDown'
    }
  });
}

  inicializarForm() {
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
    this.CliForm = this.fb.group({
      foto_perfil: [''],
      CPF: ['', Validators.required],
      // RG: ['', Validators.required],
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      endereco: ['', Validators.required],
      datanascimento: ['', Validators.required],
      nivel_experiencia: ['iniciante', Validators.required],
      plano: ['', Validators.required],
      atestado_medico: [''],
      treino_com_personal: ['nao'],
      termo_responsabilidade: [''],
      termo_autorizacao: [''],
      personal_id: [null],
    });
    this.extraForm = this.fb.group({
      nome_extra: ['', Validators.required],
      descricao_extra: ['', Validators.required],
      valor_adicional: ['', Validators.required],
      status: ['', Validators.required],
      data_adicao: ['', Validators.required],
    });
    this.planoForm = this.fb.group({
      nome: ['', ],
      preco: ['', ],
      // descontoPlano: ['', [, Validators.min(1)]],
      descricao: ['', []],
      duracao: ['', []],
      disponibilidade: ['', []],
      dias_por_semana: ['', []],
    });
  }

  openModal() {
    ($(this.modal?.nativeElement) as any).modal('show');
  }

  onPersonalToggle(event: any) {
    this.mostraSelectPersonal = event.target.checked;
    if (!this.mostraSelectPersonal) {
      this.CliForm.get('personal_id')?.setValue(null);
    }
  }

  verificarIdade() {
    const hoje = new Date();
    let datacli = this.CliForm.get("datanascimento")?.value;
    datacli = this.stringParaData(datacli);
    console.log(datacli)
    const nascimento = new Date(datacli);

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    this.menorDeIdade = idade < 18;
    console.log(this.menorDeIdade)

  }

  submitForm() {
    switch (this.tipo) {
      case 'funcionario':
        if (this.funcForm.valid) {
          const formData = new FormData();
          formData.append('foto', this.foto, this.foto.name);
          formData.append('nome', this.funcForm.value.nome);
          formData.append('funcao', this.funcForm.value.funcao);
          formData.append('telefone', this.funcForm.value.telefone);
          formData.append('email', this.funcForm.value.email);
          formData.append('senha', this.funcForm.value.senha);
          formData.append('CPF', this.funcForm.value.cpf);
          formData.append('data_nascimento', this.funcForm.value.data_nascimento);
          console.log(formData);
          this.funcservice.create(formData).subscribe({
            next: (dados) => {
              this.alertas.success(dados.msg);
              this.funcForm.reset();
              ($('#modal-cad') as any).modal('hide');
              this.CloseModal.emit();
              this.tipo = '';
            }
          })
        } else {
          this.alertas.error("Campos Vazios !!");
        }
        break;
      case 'cliente':
        if (this.CliForm.valid) {
          this.loading = true;
          console.log(this.CliForm.getRawValue());
          const formData = new FormData();
          if (this.foto) {
            formData.append('foto_perfil', this.foto_cli);
          }
          let funcionario_id = String(localStorage.getItem('idadmin'));
          let treino_com_personal = (this.CliForm.value.treino_com_personal == false) ? 'nao' : 'sim';
          const dataConvertida = this.stringParaData(this.CliForm.value.datanascimento);
          formData.append('nome', this.CliForm.value.nome);
          formData.append('endereco', this.CliForm.value.endereco);
          formData.append('telefone', this.CliForm.value.telefone);
          formData.append('CPF', this.CliForm.value.CPF);
          // formData.append('RG', this.CliForm.value.RG);
          formData.append('datanascimento', dataConvertida);
          formData.append('email', this.CliForm.value.email);
          formData.append('treino_com_personal', treino_com_personal);
          formData.append('nivel_experiencia', this.CliForm.value.nivel_experiencia);
          formData.append('termo_responsabilidade', this.termoResponsabilidade);
          formData.append('atestado_medico', this.atestadoMedico);
          formData.append('termo_autorizacao', this.termoAutorizacao);
          formData.append('personal_id', this.CliForm.value.personal_id);
          formData.append('plano', this.CliForm.value.plano);
          formData.append('funcionario_id', funcionario_id);
          this.cliservice.sendData(formData).subscribe({
            next: (dados) => {
              this.alertas.success(dados.msg);
              this.CliForm.reset();
              ($('#modal-cad') as any).modal('hide');
              this.CloseModal.emit();
              this.loading = false;
            }, error: (er) => {
              this.mostrarErro(er.error.msg);
              this.CliForm.get('CPF')?.setErrors({ duplicado: true });
              this.loading = false;
            }
          })
        } else {
          this.alertas.error("Campos Vazios !!");
          this.loading = false;
        }
        break;
      case 'planos':
        if (this.planoForm.valid) {
          this.planoForm.patchValue({
            preco : this.planoForm.get('preco')?.value.replace(/[^\d,.-]/g, '')
        });
          const dados = JSON.stringify(this.planoForm.getRawValue());
          console.log(dados);
          this.academiaservice.createPlanos(dados).subscribe({
            next: (dado) => {
              this.alertas.success(dado.msg);
              this.planoForm.reset();
              ($('#modal-cad') as any).modal('hide');
              this.CloseModal.emit();
              this.tipo = '';
              this.fileName = '';
              this.foto = '';
            }, error: (err) => {
              this.alertas.error(err.status);
              ($('#modal-cad') as any).modal('hide');
              this.CloseModal.emit();
              this.tipo = '';
              this.fileName = '';
              this.foto = '';
            },
          })
        } else {
          this.alertas.error("Campos Vazios !!");
        }
        break;
      default:
        console.log("Tipo invalido !!");
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

   onFileChangeCli(event: Event, tipo: string) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Armazena o nome do arquivo para exibição
      this.fileNames[tipo] = file.name;

      // Atribui o arquivo à propriedade correta com base no tipo
      switch (tipo) {
        case 'foto':
          this.foto = file;
          break;
        case 'atestado_medico':
          this.atestadoMedico = file;
          break;
        case 'termo_autorizacao':
          this.termoAutorizacao = file;
          break;
        case 'termo_responsabilidade':
          this.termoResponsabilidade = file;
          break;
      }
    } else {
      // Limpa o nome do arquivo se nenhum for selecionado
      this.fileNames[tipo] = '';
    }
  }
  


  adicionarBeneficio() {
    const beneficioAtual = this.planoForm.get('beneficios')?.value.trim();

    if (beneficioAtual) {
      this.beneficios.push(beneficioAtual);

      // Atualiza o campo 'beneficios' com todos os benefícios concatenados
      this.planoForm.get('beneficios')?.setValue('');  // Limpa o campo de entrada após adicionar
    }
  }

  // Função para converter text em hora //
  stringParaData(valor: string): string {
    if (!valor || valor.length !== 10) return 'invalid';
    const partes = valor.split('/');
    const dataConvertida = `${partes[2]}-${partes[1]}-${partes[0]}`;
    return dataConvertida;
  }
}
