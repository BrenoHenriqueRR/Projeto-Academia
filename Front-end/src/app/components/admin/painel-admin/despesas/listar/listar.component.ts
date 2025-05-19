import { Component } from '@angular/core';
import { Despesa, DespesasService } from '../../../../../services/admin/despesas/despesas.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [RouterLink,CommonModule,NgxPaginationModule],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.css'
})
export class ListarComponent {
  despesas: Despesa[] = [];
  public paginaAtual = 1;

  constructor(private service: DespesasService) {}

  ngOnInit(): void {
    this.service.read().subscribe(data => this.despesas = data);
  }

  excluir(id: any) {
    if (confirm('Deseja realmente excluir?')) {
      this.service.delete(JSON.stringify({id: id})).subscribe(() => {
        this.despesas = this.despesas.filter(d => d.id !== id);
      });
    }
  }
}
