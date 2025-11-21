import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalEditarService } from '../../../services/modal-editar/modal-editar.service';
import { ActivatedRoute } from '@angular/router';
import { CliPesquisar } from '../../../interfaces/cli-pesquisar';
import { CadastroService } from '../../../services/cadastro.service';
import { window } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ModalSpinnerComponent } from "../modal-spinner/modal-spinner.component";
import { provideNgxMask } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material.module';

@Component({
  selector: 'app-modal-editar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MaterialModule, ModalSpinnerComponent],
  providers: [provideNgxMask()],
  templateUrl: './modal-editar.component.html',
  styleUrl: './modal-editar.component.css'
})
export class ModalEditarFuncionarioComponent {
  @Output("enviar") onSubmit = new EventEmitter();
  formcadastro: FormGroup = new FormGroup({});
  loading = false;
  mensagemSucesso!: string;
  data: any;
  identificador!: any;
  idnamepersonal!: any;
  selectedFile: File | undefined;
  foto_perfil: string = "";


  ngOnInit() {
    this.loading = true;
    this.Bucasdados();
    setTimeout(() => {
      this.loading = false;
    },200)
    // this.form();
  }

  onFileSelected(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files![0];
  }

  constructor(private service: ModalEditarService, private route: ActivatedRoute, private personalp: CadastroService) {
    this.route.queryParams.subscribe(params => {
      this.identificador = params['id'];
    });
  }

  Bucasdados() {
    const jsonString = '{"id": "' + this.identificador + '"}';
    this.service.pesquisarP(jsonString).subscribe(
      (dados) => {
        this.data = dados;
        this.foto_perfil = environment.apiUrl + '/' + dados[0].foto;
        this.form();
      }, (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }

  cadFuncao(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedText = selectElement.options[selectElement.selectedIndex].value;
    this.formcadastro.patchValue({
      funcao: selectedText,
    });
  }

  form() {
    // Verifique se 'this.data' já está disponível
    if (this.data && this.data[0]) {
      this.formcadastro = new FormGroup({
        id: new FormControl(this.identificador),
        nome: new FormControl(this.data[0].nome, [Validators.required]),
        email: new FormControl(this.data[0].email, [Validators.required, Validators.email]),
        CPF: new FormControl(this.data[0].CPF, [Validators.required]),
        funcao: new FormControl(this.data[0].funcao, [Validators.required]),
      });

      // Para garantir que o valor é atualizado corretamente
      this.formcadastro.patchValue({
        funcao: this.data[0].funcao
      });
    } else {
      console.error('Data não carregada');
    }
  }

  edit() {
    // if (this.formcadastro.valid) {
    // Obter os valores do formulário e converter para JSON
    const dados = JSON.stringify(this.formcadastro.getRawValue());
    console.log(dados);

    this.onSubmit.emit();
    this.loading = true;

    this.service.editarfun(dados).subscribe({
      next: (resposta) => {
        this.mensagemSucesso = resposta.msg;
        alert(this.mensagemSucesso);
        // this.formcadastro.reset();
        this.loading = false;
        location.reload();

      }
    })
  }

}
