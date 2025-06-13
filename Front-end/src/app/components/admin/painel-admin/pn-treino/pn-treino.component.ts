import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadTreinoService } from '../../../../services/cad-treino/cad-treino.service';
import { CommonModule } from '@angular/common';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';   
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ModalSpinnerComponent } from '../../../modais/modal-spinner/modal-spinner.component';

@Component({
  selector: 'app-pn-treino',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatAutocompleteModule, RouterLink, ModalSpinnerComponent],
  templateUrl: './pn-treino.component.html',
  styleUrl: './pn-treino.component.css'
})
export class PnTreinoComponent {
  clienteControl = new FormControl('');
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  isLoading = false;

  constructor(private cliservice: PnClienteService, private treinoService: CadTreinoService, private router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.cliservice.pesquisar().subscribe((dados) => {
      this.verificarFichas(dados);
    });

    this.clienteControl.valueChanges.subscribe(valor => {
      this.filtrarClientes(valor || '');
    });
  }

  async verificarFichas(clientes: any) {
    const requests = clientes.map(async (cliente: { id: any; nome: any; }) => {
      try {
        const response = await firstValueFrom(
          this.treinoService.pesquisarFichaId(JSON.stringify({ id: cliente.id }))
        );
        this.isLoading = false;
        return { ...cliente, temFicha: response && response.length > 0 };
      } catch (error) {
        console.error('Erro ao buscar ficha do cliente:', cliente.nome, error);
        return { ...cliente, temFicha: false };
      }
    });

    const clientesComStatus = await Promise.all(requests);
    this.clientes = clientesComStatus;
    this.clientesFiltrados = clientesComStatus;
  }



  filtrarClientes(filtro: string) {
    const filtroLower = filtro.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(c =>
      c.nome.toLowerCase().includes(filtroLower)
    );
  }

  verFicha(id: number) {
    // Redirecionar para um componente de visualização da ficha (ou modal)
    this.router.navigate(['ver-ficha'], { queryParams: { id } });
  }
}
