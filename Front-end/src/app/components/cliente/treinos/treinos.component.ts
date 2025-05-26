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
  exercicios!: any;

  ngOnInit() {
    this.pesquisar();
  }

  constructor(
    private service: UserTreinoService,
    private fichaservice: CadTreinoService
  ) { }

  enviar() {
    const idFicha = this.ficha?.id;

    if (!idFicha) return;

    console.log(JSON.stringify({ fichas: idFicha, cliente_id: localStorage.getItem('idcliente') }));

    this.fichaservice.concluirFicha(JSON.stringify({ fichas: idFicha, cliente_id: localStorage.getItem('idcliente') })).subscribe({
      next: () => {
        alert('Ficha concluida com sucesso');
        location.reload();
      },
      error: () => {
        alert('Erro ao concluir ficha.');
      }
    });
  }

  pesquisar() {
    const idCliente = localStorage.getItem('idcliente');

    this.fichaservice.pesquisarFichaNaoConcluida(JSON.stringify({ id: idCliente })).subscribe({
      next: (dados) => {
        console.log(dados);
        if (dados?.ficha) {
          this.ficha = dados.ficha;
          this.exercicios = dados.exercicios;
        } else {
          this.ficha = null;
          this.exercicios = [];
        }
      },
      error: () => {
        console.error('Erro ao buscar ficha');
        this.ficha = null;
      }
    });
  }

}






