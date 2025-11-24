import { CommonModule } from '@angular/common';
import { Component, LOCALE_ID } from '@angular/core';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { ModalVendaComponent } from '../pn-loja/modal-venda/modal-venda.component';
import { MatDialog } from '@angular/material/dialog';
import { PnFinanceiroService } from '../../../../services/admin/pn-financeiro/pn-financeiro.service';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-cli-pagamentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  providers: [provideNgxMask(), { provide: LOCALE_ID, useValue: 'pt-BR' }],
  templateUrl: './cli-pagamentos.component.html',
  styleUrl: './cli-pagamentos.component.css'
})
export class CliPagamentosComponent {

  pagamentos: any[] = [];   // ✅ inicializado como array
  filtrado: any[] = [];
  filtroStatus: string = 'todos';
  paginaAtual = 1;
  itensPorPagina = 8;


  constructor(private pagamentosService: PnClienteService, private dialog: MatDialog, private service: PnFinanceiroService) { }

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
      p => p.status_pagamento === this.filtroStatus
    );
  }
  this.paginaAtual = 1;
}

  abrirModal(id: number) {
    const dialogRef = this.dialog.open(ModalVendaComponent, {
      width: '400px',
      data: { pagamento: this.filtrado.filter(p => p.id == id), tipo: 'pagplano' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.confirmado) {
        this.aprovarPagamento(id, result.pagamento);
      }
    });
  }

  aprovarPagamento(pagamentoId: number, formaPag: string) {
    const dados = {
      id: pagamentoId,
      forma_pagamento: formaPag
    };

    console.log('Dados para aprovação:', dados);

    this.service.updatePagamento(JSON.stringify(dados)).subscribe({
      next: (response) => {
        // console.log('Pagamento aprovado:', response);
        Swal.fire('Sucesso', 'Pagamento aprovado com sucesso!', 'success');
        this.ngOnInit();
      },
      error: (error) => {
        // console.error('Erro ao aprovar pagamento:', error);
        Swal.fire('Erro', 'Não foi possível aprovar o pagamento.', 'error');
      }
    });
  }

  // realizarPagamento(id: number): void {
  //   if (confirm('Confirmar pagamento?')) {
  //     this.pagamentosService.realizarPagamento(JSON.stringify({ id: id })).subscribe({
  //       next: () => this.ngOnInit(), // ✅ recarrega lista
  //       error: err => console.error('Erro ao realizar pagamento:', err)
  //     });
  //   }
  // }

  removerPagamento(arg0: any) {
    throw new Error('Method not implemented.');
  }
}
