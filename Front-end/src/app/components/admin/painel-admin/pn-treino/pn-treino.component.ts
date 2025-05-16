import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadTreinoService } from '../../../../services/cad-treino/cad-treino.service';
import { CommonModule } from '@angular/common';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-pn-treino',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatAutocompleteModule],
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
    console.log('Cliente selecionado:', this.clienteSelecionado);
  }
}
