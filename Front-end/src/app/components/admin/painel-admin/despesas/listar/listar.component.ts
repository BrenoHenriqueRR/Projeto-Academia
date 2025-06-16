import { Component } from '@angular/core';
import { Despesa, DespesasService } from '../../../../../services/admin/despesas/despesas.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalSpinnerComponent } from '../../../../modais/modal-spinner/modal-spinner.component';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [RouterLink, CommonModule, NgxPaginationModule, ModalSpinnerComponent],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.css'
})
export class ListarComponent {
  despesas: Despesa[] = [];
  isloading = false;
  public paginaAtual = 1;

  constructor(private service: DespesasService) { }

  ngOnInit(): void {
    this.pesquisar();
  }

  pesquisar() {
    this.isloading = true
    this.service.read().subscribe({
      next: (data) => {
        this.despesas = data;
        this.isloading = false;
      },error: (er) =>{
        console.error(er);
        this.isloading = false;
      }
    });
  }

  excluir(id: any) {
    if (confirm('Deseja realmente excluir?')) {
      this.service.delete(JSON.stringify({ id: id })).subscribe(() => {
        this.despesas = this.despesas.filter(d => d.id !== id);
      });
    }
  }
}
