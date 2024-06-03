import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalEditarService } from '../../../services/modal-editar/modal-editar.service';
import { ActivatedRoute } from '@angular/router';
// import { CliPesquisar } from '../../../interfaces/cli-pesquisar';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  @Output("enviar") onSubmit = new EventEmitter();
  formcadastro: FormGroup = new FormGroup({});
  selectedFile!: File;
  imageUrl!: string;
  loading = false;
  mensagemSucesso!: string;
  data: any;
  btn_editar:boolean = false;
  identificador!: any;
  
  
  constructor(private service: ModalEditarService, private route: ActivatedRoute){
    // this.route.queryParams.subscribe(params => {
    //   this.identificador = params['id'];
    // }); 
    this.identificador = localStorage.getItem("idcliente");
    this.Bucasdados(); 
  }

  onFileSelected(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files![0];
    this.uploadImage();
  }

  uploadImage() {
    if (!this.selectedFile) {
      console.log('Nenhuma imagem selecionada.');
      return;
    }else{
      console.log(this.selectedFile)
    }
  }


  HabilitarEditar(){
    this.btn_editar = true;
  }

  Bucasdados(){
    const jsonString  = '{"id": "' + this.identificador + '"}';
    this.service.pesquisar(jsonString).subscribe(
      (dados) => {
        this.data = dados;
        // console.log(dados);
        this.form();
      },(erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }
  
  form(){
    if (this.data && this.data.length > 0) {
      this.formcadastro = new FormGroup({
        id: new FormControl(this.identificador),
        nome: new FormControl(this.data[0].cliente_nome, [Validators.required]),
        email: new FormControl(this.data[0].email, [Validators.required, Validators.email]),
        CPF: new FormControl(this.data[0].CPF, [Validators.required]),
        // personal_id: new FormControl(this.data[0].nome_personal, [Validators.required] ),
      });
    } else {
      // Trate o caso em que nenhum dado foi retornado ou os dados estão vazios
      console.error('Dados não encontrados ou vazios.');
    }
  }
  
  edit(){
      const dados = JSON.stringify(this.formcadastro.getRawValue());
      console.log(dados);
        
      this.onSubmit.emit();
      this.loading = true;
    
      this.service.editar(dados).subscribe({
        next: (resposta) => {
          this.mensagemSucesso = resposta.msg ;
          console.log(this.mensagemSucesso);
          // location.reload();
          this.loading = false;
          this.btn_editar = false;
          }
        })
      }
}
