import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalEditarService } from '../../../services/modal-editar/modal-editar.service';
import { ActivatedRoute } from '@angular/router';
import { CliPesquisar } from '../../../interfaces/cli-pesquisar';
import { CadastroService } from '../../../services/cadastro.service';
import { window } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PnClienteService } from '../../../services/admin/pn-cliente/pn-cliente.service';
import { ModalSpinnerComponent } from "../modal-spinner/modal-spinner.component";
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ConfigService } from '../../../services/admin/config/config.service';

@Component({
  selector: 'app-modal-editar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalSpinnerComponent, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './modal-editar.component.html',
  styleUrl: './modal-editar.component.css'
})
export class ModalEditarComponent {
  @Output("enviar") onSubmit = new EventEmitter();
  formcadastro: FormGroup = new FormGroup({});
  loading = false;
  mensagemSucesso!: string;
  data: any;
  identificador!: any;
  idnamepersonal!: any;
  selectedFile: File | undefined;
  foto_perfil: string = "";
  verifi_foto_perfil: string = "";
  planos: any;
  menorDeIdade = false;


  ngOnInit() {
    this.loading = true;
    setTimeout(async () => {
      await this.personal();
      await this.pesquisarPlanos();
      await this.Bucasdados();
      this.loading = false;
    }, 200)
  }

  constructor(private service: ModalEditarService, private route: ActivatedRoute,
    private personalp: CadastroService, private cliservice: PnClienteService,
    private planoService: ConfigService, private alertas: ToastrService) {
    this.route.queryParams.subscribe(params => {
      this.identificador = params['id'];
    });
  }

  onFileSelected(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files![0];
    const dados = new FormData;
    dados.append('foto', this.selectedFile, this.selectedFile.name);
    dados.append('id', this.identificador);
    this.cliservice.inserirfoto(dados).subscribe({
      next: (dados) => {
        this.ngOnInit();
        this.alertas.success(dados.msg);
      }, error: (err) => {
        console.log(err);
        this.alertas.error("ocorreu um erro");
      }
    })
  }

  verificarIdade() {
    const hoje = new Date();
    let datacli = this.formcadastro.get("datanascimento")?.value;
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


  Bucasdados(): Promise<void> {
    return new Promise((resolve, reject) => {
      const jsonString = '{"id": "' + this.identificador + '"}';
      this.service.pesquisar(jsonString).subscribe({
        next: (dados) => {
          console.log(dados);
          this.data = Array(dados);
          this.foto_perfil = environment.apiUrl + '/' + this.data[0].foto_perfil;
          this.verifi_foto_perfil = this.data[0].verifi_img;
          // console.log(this.verifi_foto_perfil)
          this.form();
          resolve();
        }, error: (erro) => {
          console.error('Erro ao buscar dados:', erro);
          reject(erro);
        }
      });
    });
  }

  form() {
    if (this.data && this.data.length > 0) {
      this.formcadastro = new FormGroup({
        id: new FormControl(this.identificador),
        nome: new FormControl(this.data[0].nome, Validators.required),
        email: new FormControl(this.data[0].email, [Validators.required]),
        CPF: new FormControl(this.data[0].CPF, Validators.required),
        personal_id: new FormControl(this.data[0].personal_id, Validators.required),
        foto_perfil: new FormControl(null),
        // RG: new FormControl(this.data[0].RG, Validators.required),
        telefone: new FormControl(this.data[0].telefone, Validators.required),
        endereco: new FormControl(this.data[0].endereco, Validators.required),
        datanascimento: new FormControl(this.data[0].datanascimento, Validators.required),
        nivel_experiencia: new FormControl(this.data[0].nivel_experiencia, Validators.required),
        plano: new FormControl(this.data[0].plano_id, Validators.required),
        atestado_medico: new FormControl(this.data[0].atestado_medico),
        termo_responsabilidade: new FormControl(this.data[0].termo_responsabilidade),
        termo_autorizacao: new FormControl(this.data[0].termo_autorizacao),
      });
    } else {
      // Trate o caso em que nenhum dado foi retornado ou os dados estão vazios
      console.error('Dados não encontrados ou vazios.');
    }
  }

  edit() {
    if (this.formcadastro.valid) {
      const dados = JSON.stringify(this.formcadastro.getRawValue());
      console.log(dados);

      this.onSubmit.emit();
      this.loading = true;

      this.service.editar(dados).subscribe({
        next: (resposta) => {
          this.alertas.success(resposta.msg);
          this.loading = false;
          this.ngOnInit();
        }
      })
    } else {
      this.alertas.error("Campos invalidos")
    }
  }

  cadFuncao(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedText = selectElement.options[selectElement.selectedIndex].value;
    this.formcadastro.patchValue({
      personal_id: selectedText,
    });
  }

  personal(): Promise<void> {
    return new Promise((resolve, reject) => {

      this.personalp.pesquisar().subscribe({
        next: (dado) => {
          // console.log('Dados recebidos:', dado);
          this.idnamepersonal = dado;
          resolve();

        },
        error: (erro) => {
          console.error('Erro ao buscar dados:', erro);
          reject(erro);
        }
      });
    });
  }

  pesquisarPlanos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.planoService.pesquisarPlanos().subscribe({
        next: (dados) => {
          this.planos = dados;
          console.log(dados);
          resolve();
        }, error: (err) => {
          console.log(err);
          reject(err);
        }
      })
    });
  }

  stringParaData(valor: string): string {
    if (!valor || valor.length !== 10) return 'invalid';
    const partes = valor.split('/');
    const dataConvertida = `${partes[2]}-${partes[1]}-${partes[0]}`;
    return dataConvertida;
  }
}
