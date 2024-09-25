import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalEditarService } from '../../../services/modal-editar/modal-editar.service';
import { ActivatedRoute } from '@angular/router';
import { CliPesquisar } from '../../../interfaces/cli-pesquisar';
import { CadastroService } from '../../../services/cadastro.service';
import { window } from 'rxjs';

@Component({
  selector: 'app-modal-editar',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
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

  ngOnInit(){
    this.Bucasdados();
    // this.form();
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
        // console.log(dados);
        this.form();
      }, (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }

  cadFuncao(event : Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedText = selectElement.options[selectElement.selectedIndex].text;
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
