import { NgFor, NgIf } from '@angular/common';
import { Component, input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfigService } from '../../../services/admin/config/config.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalSpinnerComponent } from '../modal-spinner/modal-spinner.component';
import { PlanosServiceService } from '../../../services/planosService/planos-service.service';

@Component({
  selector: 'app-modal-editar-planos',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule,ModalSpinnerComponent],
  templateUrl: './modal-editar-planos.component.html',
  styleUrl: './modal-editar-planos.component.css'
})
export class ModalEditarPlanosComponent {
  identificador: number = 0;
  tipo: string = '';
  loading = false;
  planos: any;
  planosForm: FormGroup = new FormGroup({});;
  // novoBeneficio: string = ''; // Benefício atual que será adicionado
  // beneficioAtual: string = '';  // Para armazenar o benefício que está sendo adicionado ou editado
  // beneficios: string[] = [];    // Array para armazenar os benefícios
  // indiceEdicao: number | null = null; // Armazena o índice do benefício que está sendo editado
  editar :boolean = false;
  option_frequencia = [2,3,7];

  ngOnInit(){  
    this.loading = true;
    setTimeout(async () => {
      await this.buscarDados();
      this.loading = false;
    },200);
    
  }

  constructor(private route: ActivatedRoute, private service: ConfigService,
    private fb: FormBuilder, private planosService: PlanosServiceService) {
    this.route.queryParams.subscribe(params => {
      this.identificador = params['id'];
      this.tipo = params['tipo'];
    });
  }

  form(){
    this.planosForm = new FormGroup({
      nome:  new FormControl(this.planos[0].nome, [Validators.required]),
      preco: new FormControl(this.planos[0].preco, [Validators.required]),
      // descontoPlano: ('', ([Validators.required], Validators.min(1)]],
      // beneficios: new FormControl (this.planos[0].beneficios, [Validators.required]),
      descricao: new FormControl (this.planos[0].descricao, [Validators.required]),
      duracao: new FormControl (this.planos[0].duracao, [Validators.required]),
      disponibilidade: new FormControl (this.planos[0].disponibilidade, [Validators.required]),
      dias_por_semana: new FormControl (this.planos[0].dias_por_semana, [Validators.required])
    });
    //  this.beneficios = this.planos[0].beneficios;
    //  console.log(this.beneficios);
    // this.beneficios = this.planosForm.get('beneficios')?.value
    //   ? this.planosForm.get('beneficios')?.value.split(', ')
    //   : [];
  }

  buscarDados() : Promise<void>{
     return new Promise((resolve, reject) => {
    switch (this.tipo) {
      case 'plano':
        this.service.pesquisarPlanosID(this.identificador).subscribe({
          next: (dados) =>{
            console.log(dados)
            this.planos = Array(dados);
            this.form();
            resolve();
          },error: (erro) => {
            alert("erro ao pesquisar dados \n status:" + erro.status);
            reject(erro);
          }
        })
        break;
      case 'extra':
        
        break;
      default:
        break;
    }
    });
  }

  salvar() {
    if (this.planosForm.valid) {
      this.loading = true;
      const dadosAtualizados = JSON.stringify({...this.planosForm.value,id: this.identificador});
      console.log(dadosAtualizados);
      this.planosService.editar(dadosAtualizados).subscribe({
        next: (resposta) => {
          alert('Plano atualizado com sucesso!');
          this.loading = false;
          // Aqui você pode fechar o modal ou atualizar a tela conforme necessário
        },
        error: (erro) => {
          alert('Erro ao atualizar plano\nStatus: ' + erro.status);
          this.loading = false;
        }
      });
    } else {
      alert('Preencha todos os campos obrigatórios corretamente.');
    }
  }

}
