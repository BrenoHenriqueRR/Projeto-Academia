import { CommonModule } from '@angular/common';
import { Component, LOCALE_ID } from '@angular/core';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-cli-pagamentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  providers: [provideNgxMask(),{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  templateUrl: './cli-pagamentos.component.html',
  styleUrl: './cli-pagamentos.component.css'
})
export class CliPagamentosComponent {

  pagamentos: any[] = [];   // ✅ inicializado como array
  filtrado: any[] = [];
  filtroStatus: string = 'todos';

  constructor(private pagamentosService: PnClienteService) {}

  ngOnInit(): void {
    this.pagamentosService.listarTodosPag().subscribe({
      next: (res: any[]) => {
        this.pagamentos = res;
        console.log(this.pagamentos);
        this.aplicarFiltro();
      },
      error: err => {
        console.error('Erro ao carregar pagamentos:', err);
      }
    });
  }

  aplicarFiltro(): void {
    if (this.filtroStatus === 'todos') {
      this.filtrado = this.pagamentos;
    } else {
      this.filtrado = this.pagamentos.filter(
        (p: { status_pagamento: string }) => p.status_pagamento === this.filtroStatus
      );
    }
  }

  realizarPagamento(id: number): void {
    if (confirm('Confirmar pagamento?')) {
      this.pagamentosService.realizarPagamento(JSON.stringify({id: id})).subscribe({
        next: () => this.ngOnInit(), // ✅ recarrega lista
        error: err => console.error('Erro ao realizar pagamento:', err)
      });
    }
  }

  removerPagamento(arg0: any) {
throw new Error('Method not implemented.');
}
}
