import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfigService } from '../../../services/admin/config/config.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-editar-planos',
  standalone: true,
  imports: [NgIf,NgFor,RouterLink, ReactiveFormsModule],
  templateUrl: './modal-editar-planos.component.html',
  styleUrl: './modal-editar-planos.component.css'
})
export class ModalEditarPlanosComponent {
  identificador: number = 0;
  tipo: string = '';
  planos: any;
  planosForm: FormGroup = new FormGroup({});;
  novoBeneficio: string = ''; // Benefício atual que será adicionado
  beneficioAtual: string = '';  // Para armazenar o benefício que está sendo adicionado ou editado
  beneficios: string[] = [];    // Array para armazenar os benefícios
  indiceEdicao: number | null = null; // Armazena o índice do benefício que está sendo editado


  ngOnInit(){   
    this.buscarDados();
  }

  constructor(private route: ActivatedRoute, private service: ConfigService,private fb: FormBuilder){
    this.route.queryParams.subscribe(params => {
      this.identificador = params['id'];
      this.tipo = params['tipo'];
    });
  }

  adicionarBeneficio() {
    if (this.planosForm.value.beneficios.trim()) {
      this.beneficios.push(this.planosForm.value.beneficios.trim());
      this.planosForm.value.beneficios = ''; // Limpa o campo textarea

      // Atualiza o campo 'beneficios' do formulário com todos os benefícios concatenados
      this.planosForm.get('beneficios')?.setValue(this.beneficios.join(', '));
    }
  }

  form(){
    this.planosForm = new FormGroup({
      nome:  new FormControl(this.planos[0].nome, [Validators.required]),
      preco: new FormControl(this.planos[0].preco, [Validators.required]),
      // descontoPlano: ('', ([Validators.required], Validators.min(1)]],
      descricao: new FormControl (this.planos[0].descricao, [Validators.required]),
      duracao: new FormControl (this.planos[0].duracao, [Validators.required]),
      beneficios: new FormControl (this.planos[0].beneficios, [Validators.required]),
      disponibilidade: new FormControl (this.planos[0].disponibilidade, [Validators.required])
    });
    //  this.beneficios = this.planos[0].beneficios;
    //  console.log(this.beneficios);
    this.beneficios = this.planosForm.get('beneficios')?.value
      ? this.planosForm.get('beneficios')?.value.split(', ')
      : [];
  }

  buscarDados(){
    switch (this.tipo) {
      case 'plano':
        this.service.pesquisarPlanosID(this.identificador).subscribe({
          next: (dados) =>{
            console.log(dados)
            this.planos = Array(dados);
            this.form();
          },error: (erro) => {
            alert("erro ao pesquisar dados \n status:" + erro.status);
          }
        })
        break;
      case 'extra':
        
        break;
      default:
        break;
    }
  }

  adicionarOuEditarBeneficio() {
    if (this.beneficioAtual.trim()) {
      if (this.indiceEdicao === null) {
        // Adicionando um novo benefício
        this.beneficios.push(this.beneficioAtual.trim());
      } else {
        // Editando um benefício existente
        this.beneficios[this.indiceEdicao] = this.beneficioAtual.trim();
        this.indiceEdicao = null; // Resetar o índice de edição
      }

      this.planosForm.get('beneficios')?.setValue(this.beneficios.join(', '));
      
      // Limpa o campo de texto e atualiza o formulário
      this.beneficioAtual = '';
    }
  }

  editarBeneficio(index: number) {
    this.beneficioAtual = this.beneficios[index]; // Carrega o benefício no textarea
    this.indiceEdicao = index; // Define o índice do benefício que está sendo editado
  }

  removerBeneficio(index: number) {
    this.beneficios.splice(index, 1); // Remove o benefício da lista
    this.planosForm.get('beneficios')?.setValue(this.beneficios.join(', ')); // Atualiza o campo do formulário
  }

}
