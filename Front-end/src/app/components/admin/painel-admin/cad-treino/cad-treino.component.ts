import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgModel, NgSelectOption, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CadTreinoService } from '../../../../services/cad-treino/cad-treino.service';
import { TreinoItem } from '../../../../interfaces/treino-item';


@Component({
  selector: 'app-cad-treino',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './cad-treino.component.html',
  styleUrl: './cad-treino.component.css'
})
export class CadTreinoComponent {
  ttreino!: any;
  gtreino!: any;
  etreino!: any;
  tipo: any;
  grupo: any;
  exer: any[] = [];
  teste : any;

  isDisabled: boolean = false;
  inputData!: any;
  treinos: TreinoItem[] = [];
  formcadastro!: FormGroup;
  cliente!: string;
  click: boolean = false;
  mensagemSucesso!: string;

  constructor(private route: ActivatedRoute, private service: CadTreinoService){
    this.route.queryParams.subscribe(params => {
      this.cliente = params['id'] ;
    });
    this.formcadastro = new FormGroup({
     treino: new FormControl('', [Validators.required]),
     grupo: new FormControl('', [Validators.required]),
     exer: new FormControl('', [Validators.required]),
     series: new FormControl('', [Validators.required]),
     repeticoes: new FormControl('', [Validators.required]),
     cliente_id : new FormControl(this.cliente),
     funcionario_id : new FormControl(localStorage.getItem('id')),
    });
  }

  ptreino(){
    this.service.ptipo().subscribe({
      next: (dados) => {
        this.ttreino = dados;
      }
    })
  }

  pgrupo(){
    this.service.pgrupo().subscribe({
      next: (dados) => {
        this.gtreino = dados;
      }
    })
  }

  pgexer(){
    this.service.pexer().subscribe({
      next: (dados) => {
        this.etreino = dados;
      }
    })
  }

  submit(){
    // if (this.formcadastro.valid) {
      
      this.isDisabled = false;
      const dados = JSON.stringify(this.treinos);
      this.service.enviar(dados).subscribe({
        next: (resposta) => {
          this.mensagemSucesso = resposta.msg ;
          console.log(this.mensagemSucesso);
          this.formcadastro.reset();
        }
      })
      location.reload();
  // }
  }

  adicionarTreino(){
    for(let i = 0; i < this.etreino.length; i++){
      if( this.formcadastro.value.exer == this.etreino[i].id)
        this.exer.push(this.etreino[i].exercicio);
    }


    if (this.formcadastro.valid) {
      const novoItem: TreinoItem = {
        treino_id: this.formcadastro.value.treino,
        grupo_id: this.formcadastro.value.grupo,
        exer_id: this.formcadastro.value.exer,
        series: this.formcadastro.value.series,
        repeticoes: this.formcadastro.value.repeticoes,
        cliente_id: this.formcadastro.value.cliente_id,
        funcionario_id: this.formcadastro.value.funcionario_id
      };
      this.treinos.push(novoItem);

      // this.formcadastro.reset();
      this.click = true;
      //Desabilita a edição do grupo e treinos
      this.isDisabled = true;
    }
  }
  onTreinoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedText = selectElement.options[selectElement.selectedIndex].text;
    this.tipo = selectedText;
    
  } 
  ongrupoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedText = selectElement.options[selectElement.selectedIndex].text;
    this.grupo = selectedText;
    
  } 
}
