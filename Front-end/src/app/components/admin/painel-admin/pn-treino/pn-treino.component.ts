import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadTreinoService } from '../../../../services/cad-treino/cad-treino.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pn-treino',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './pn-treino.component.html',
  styleUrl: './pn-treino.component.css'
})
export class PnTreinoComponent {
  exer!: FormGroup;
  Grupo!: FormGroup;
  fichas!: any;
  clientes: any;

  constructor(private service: CadTreinoService){
    this.exer = new FormGroup({
      exercicio: new FormControl(''),
    });
    this.Grupo = new FormGroup({
      grupo: new FormControl(''),
    })
  }

  cadexer(){
    if (this.exer.valid) {
      // Obter os valores do formulário e converter para JSON
      const dados = JSON.stringify(this.exer.getRawValue());
      this.service.cadexer(dados).subscribe({
        next:(dados) =>{
          alert(dados.msg);
          this.exer.reset();
        }
      })
    }
  }

  cadgrupo(){
    if (this.Grupo.valid) {
      // Obter os valores do formulário e converter para JSON
      const dados = JSON.stringify(this.Grupo.getRawValue());
      this.service.cadgrupo(dados).subscribe({
        next:(dados) =>{
          alert(dados.msg);
          this.Grupo.reset();
        }
      })
    }
  }
}
