import { NgIf } from '@angular/common';
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

@Component({
  selector: 'app-modal-editar',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, ModalSpinnerComponent ,NgxMaskDirective],
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
foto_perfil : string = "";
verifi_foto_perfil : string = "";

ngOnInit(){
  this.loading = true;
  setTimeout(() =>{
    this.Bucasdados(); 
    this.personal();
    this.loading = false;
  },200)
}

constructor(private service: ModalEditarService, private route: ActivatedRoute,
  private personalp: CadastroService, private cliservice: PnClienteService, private alertas : ToastrService){
  this.route.queryParams.subscribe(params => {
    this.identificador = params['id'];
  });
}

onFileSelected(event: Event) {
  this.selectedFile = (event.target as HTMLInputElement).files![0];
  const dados = new FormData;
  dados.append('foto',this.selectedFile, this.selectedFile.name);
  dados.append('id',this.identificador);
  this.cliservice.inserirfoto(dados).subscribe({
    next : (dados) =>{
      this.ngOnInit();
      this.alertas.success(dados.msg);
    },error : (err) =>{
      console.log(err);
      this.alertas.error("ocorreu um erro");
    }
  })
}


Bucasdados(){
  const jsonString  = '{"id": "' + this.identificador + '"}';
  this.service.pesquisar(jsonString).subscribe({
    next: (dados) => {
      console.log(dados);
      this.data = Array(dados);
      this.foto_perfil = environment.apiUrl + '/' +  this.data[0].foto_perfil;
      this.verifi_foto_perfil = this.data[0].verifi_img;
      // console.log(this.verifi_foto_perfil)
      this.form();
    },error: (erro) => {
      console.error('Erro ao buscar dados:', erro);
    }
  });
}

form(){
  if (this.data && this.data.length > 0) {
    this.formcadastro = new FormGroup({
      id: new FormControl (this.identificador),
      nome: new FormControl(this.data[0].cliente_nome, [Validators.required]),
      email: new FormControl(this.data[0].email, [Validators.required, Validators.email]),
      CPF: new FormControl(this.data[0].CPF, [Validators.required]),
      personal_id: new FormControl(this.data[0].personal_id, [Validators.required] ),
    });
  } else {
    // Trate o caso em que nenhum dado foi retornado ou os dados estão vazios
    console.error('Dados não encontrados ou vazios.');
  }
}

edit(){
  // if (this.formcadastro.valid) {
    // Obter os valores do formulário e converter para JSON
    const dados = JSON.stringify(this.formcadastro.getRawValue());
    console.log(dados);
      
    this.onSubmit.emit();
    this.loading = true;

    this.service.editar(dados).subscribe({
      next: (resposta) => {
        this.alertas.success(resposta.msg) ;
        this.loading = false;
        this.ngOnInit();  
        }
      })
    }
  // }
  cadFuncao(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedText = selectElement.options[selectElement.selectedIndex].value;
    this.formcadastro.patchValue({
      personal_id: selectedText,
    });
  }
  personal(){
    this.personalp.pesquisar().subscribe({
      next: (dado) => {
        // console.log('Dados recebidos:', dado);
        this.idnamepersonal = dado;
        
      },
      error : (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
  });
  }
}
