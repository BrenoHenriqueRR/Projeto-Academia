import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PnFuncionarioService } from '../../../services/admin/pn-funcionario/pn-funcionario.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../../../services/admin/config/config.service';

@Component({
  selector: 'app-modal-cadastro',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, NgxMaskDirective, NgFor],
  templateUrl: './modal-cadastro.component.html',
  providers: [provideNgxMask()],
  styleUrl: './modal-cadastro.component.css'
})
export class ModalCadastroComponent {

  @Input() tipo: string = ''; // tipo do cadastro 
  @Output() CloseModal = new EventEmitter<void>();
  CliForm!: FormGroup<any>;
  funcForm: FormGroup;
  planoForm: FormGroup<any>;
  extraForm: FormGroup<any>;
  fileName: string = 'Nenhum arquivo selecionado';
  foto: any;
  planos: any;
  novoBeneficio: string = '';
  beneficios: string[] = [];

  ngOnInit() {
    this.academiaservice.pesquisarPlanos().subscribe({
      next: (dado) => {
        this.planos = dado;
      }
    })
  }

  constructor(private fb: FormBuilder, private funcservice: PnFuncionarioService, private alertas: ToastrService,
    private academiaservice: ConfigService) {
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
      foto_perfil: ['', Validators.required],
      nome: ['', Validators.required],
      endereco: ['', Validators.required],
      telefone: ['', Validators.required],
      CPF: ['', Validators.required],
      data_nascimento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
    this.extraForm = this.fb.group({
      nome_extra: ['', Validators.required],
      descricao_extra: ['', Validators.required],
      valor_adicional: ['', Validators.required],
      status: ['', Validators.required],
      data_adicao: ['', Validators.required],
      plano_id: ['', Validators.required],
    });
    this.planoForm = this.fb.group({
      nome: ['', Validators.required],
      preco: ['', Validators.required],
      // descontoPlano: ['', [Validators.required, Validators.min(1)]],
      descricao: ['', [Validators.required]],
      duracao: ['', [Validators.required]],
      beneficios: ['', [Validators.required]],
      disponibilidade: ['', [Validators.required]]
    });


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
          this.funcservice.create(formData).subscribe({
            next: (dados) => {
              this.alertas.success(dados.msg);
              this.funcForm.reset();
              $('#exampleModal').modal('hide');
              this.CloseModal.emit();
              this.tipo = '';
            }
          })
        } else {
          this.alertas.error("Campos Vazios !!");
        }
        break;
      case 'cliente':
        break;
      case 'planos':
        for (let index = 0; index < this.beneficios.length; index++) {
          this.planoForm.get('beneficios')?.setValue(this.beneficios.join(', '))
        }
        if (this.planoForm.valid) {
          const dados = JSON.stringify(this.planoForm.getRawValue());
          this.academiaservice.createPlanos(dados).subscribe({
            next: (dado) => {
              this.alertas.success(dado.msg);
              this.planoForm.reset();
              $('#exampleModal').modal('hide');
              this.CloseModal.emit();
              this.tipo = '';
            }, error: (err) => {
              this.alertas.error(err.status);
              $('#exampleModal').modal('hide');
              this.CloseModal.emit();
              this.tipo = '';
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


  adicionarBeneficio() {
    const beneficioAtual = this.planoForm.get('beneficios')?.value.trim();

    if (beneficioAtual) {
      this.beneficios.push(beneficioAtual);

      // Atualiza o campo 'beneficios' com todos os benefícios concatenados
      this.planoForm.get('beneficios')?.setValue('');  // Limpa o campo de entrada após adicionar
    }
  }
}
