import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UserTreinoService } from '../../../services/treino/user-treino.service';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, FormArray, ReactiveFormsModule } from '@angular/forms';
import { FichaService } from '../../../services/ficha/ficha.service';
import { CadTreinoComponent } from '../../admin/painel-admin/cad-treino/cad-treino.component';
import { CadTreinoService } from '../../../services/cad-treino/cad-treino.service';



@Component({
  selector: 'app-treinos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './treinos.component.html',
  styleUrl: './treinos.component.css'
})
export class TreinosComponent {
  ficha!: any;
  exercicios!:any

  constructor(private service: UserTreinoService, private fichaservice: CadTreinoService) {

    this.pesquisar();
  }


  enviar() {

  }


  pesquisar() {
    this.fichaservice.pesquisarFichaNaoConcluida(JSON.stringify({ id: localStorage.getItem('idcliente') })).subscribe({
      next: (dados) => {
        if (dados) {
          this.ficha  = Array(dados.ficha);
          this.exercicios = dados.exercicios
          // console.log(dados);
        }
      }
    });
  }

}






