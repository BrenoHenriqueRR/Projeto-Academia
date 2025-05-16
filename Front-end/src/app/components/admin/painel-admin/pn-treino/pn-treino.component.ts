import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadTreinoService } from '../../../../services/cad-treino/cad-treino.service';
import { CommonModule } from '@angular/common';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pn-treino',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatAutocompleteModule,RouterLink],
  templateUrl: './pn-treino.component.html',
  styleUrl: './pn-treino.component.css'
})
export class PnTreinoComponent {
  clienteControl = new FormControl('');
  exer!: FormGroup;
  Grupo!: FormGroup;
  fichas!: any;
  clientes: any;
  clientesFiltrados: any[] = [];
  clienteSelecionado: any = null;

  constructor(private service: CadTreinoService, private cliservice: PnClienteService) { }

  ngOnInit() {
    this.pesquisarCli();

    this.clienteControl.valueChanges.subscribe(valor => {
      this.clientesFiltrados = this.filtrarClientes(valor || '');
    });
  }

  pesquisarCli() {
    this.cliservice.pesquisar().subscribe({
      next: (dados) => {
        this.clientes = dados;
      },
      error: (err) => {
        console.log('ocorreu um erro: ' + err);
      },
    });
  }

  pesquisarFicha(id: any) {
    const cliente_id = JSON.stringify({ id: id });
    this.service.pesquisarFichaId(cliente_id).subscribe({
      next: (dados) => {
        const fichasAgrupadas: { [key: string]: any } = {};

        dados.forEach((item: any) => {
          if (!fichasAgrupadas[item.ficha_id]) {
            fichasAgrupadas[item.ficha_id] = {
              ficha_id: item.ficha_id,
              tipo: item.tipo,
              ordem: item.ordem,
              concluida: item.concluida,
              exercicios: []
            };
          }

          fichasAgrupadas[item.ficha_id].exercicios.push({
            ficha_exercicio_id: item.ficha_exercicio_id,
            exercicio: item.exercicio,
            grupo_muscular: item.grupo_muscular,
            repeticoes: item.repeticoes,
            series: item.series,
            observacoes: item.observacoes
          });
        });

        
        this.fichas = Object.values(fichasAgrupadas).map((ficha: any) => {
          const gruposUnicos = [...new Set(ficha.exercicios.map((e: any) => e.grupo_muscular))];
          return { ...ficha, gruposMusculares: gruposUnicos };
        });

        // Converte de objeto para array
        console.log(this.fichas);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  filtrarClientes(valor: string) {
    const filtro = valor.toLowerCase();
    return this.clientes.filter((c: { nome: string }) =>
      c.nome.toLowerCase().includes(filtro)
    );
  }

  selecionarCliente(nome: string) {
    this.clienteSelecionado = this.clientes.find(
      (c: { nome: string }) => c.nome === nome
    );
    this.pesquisarFicha(this.clienteSelecionado.id);
  }
}
