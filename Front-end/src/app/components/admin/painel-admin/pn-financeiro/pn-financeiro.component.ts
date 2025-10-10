import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { PnFinanceiroService } from '../../../../services/admin/pn-financeiro/pn-financeiro.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ModalVendaComponent } from '../pn-loja/modal-venda/modal-venda.component';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../../modules/material.module';
import { ModalSpinnerComponent } from '../../../modais/modal-spinner/modal-spinner.component';
import moment from 'moment';
import { DatapickerComponent } from "../../../datapicker/datapicker.component";


@Component({
  selector: 'app-pn-financeiro',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink, MaterialModule,
    ModalSpinnerComponent, DatapickerComponent],
  templateUrl: './pn-financeiro.component.html',
  styleUrl: './pn-financeiro.component.css'
})
export class PnFinanceiroComponent {
  // Propriedades existentes
  mes = new Date().getMonth() + 1;
  ano = new Date().getFullYear();
  data_group !: FormGroup;
  resumo: any;
  selected!: { startDate: moment.Moment, endDate: moment.Moment };

  // Novas propriedades para funcionalidades avançadas
  listaPagamentos: any[] = [];
  alertasFinanceiros: Array<{ tipo: 'warning' | 'danger' | 'info', mensagem: string }> = [];
  listaDespesas: any[] = [];
  listaVendas: any[] = [];
  pagamentosPendentes: any[] = [];
  clientesAtivos: number = 0;
  margemLucro: number = 0;
  loading = false;

  // No seu .ts
  // Dados para gráficos (pode ser expandido futuramente)
  dadosGrafico = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    receitas: [1200, 1500, 1800, 1600, 367],
    despesas: [800, 900, 1200, 1100, 20000]
  };

  constructor(
    private service: PnFinanceiroService,
    private clienteService: PnClienteService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.selected = {
      startDate: moment().subtract(29, 'days'),
      endDate: moment()
    };
     this.data_group = new FormGroup({
      start: new FormControl(this.selected.startDate, [Validators.required]),
      end: new FormControl(this.selected.endDate, [Validators.required]),
      Sstart: new FormControl(this.selected.startDate.format('YYYY-MM-DD')), // string formatada
      Send: new FormControl(this.selected.endDate.format('YYYY-MM-DD')),     // string formatada
    });

    this.carregarResumo();
    this.carregarClientesAtivos();
    this.carregarPagamentos();
  }

  carregarResumo() {
    this.loading = true;
    // this.data_group.value.start == null && this.data_group.value.end == null
    if (!this.data_group.valid) {
      this.service.getResumo(this.data_group.value.Sstart,
      this.data_group.value.Send)
        .subscribe({
          next: (data) => {
            this.resumo = data;
            this.calcularMargemLucro();
            this.getAlertasFinanceiros();
            this.loading = false;
            console.log('Resumo carregado:', data);
          },
          error: (error) => {
            console.error('Erro ao carregar resumo:', error);
            this.loading = false;
          }
        });
    } else {
      this.service.getResumoPeriodo(this.data_group.value.Sstart, this.data_group.value.Send)
        .subscribe({
          next: (data) => {
            this.resumo = data;
            this.calcularMargemLucro();
            this.getAlertasFinanceiros();
            this.loading = false;
            console.log('Resumo carregado:', data);
            this.data_group.patchValue({
              start: null,
              end: null
            })
          },
          error: (error) => {
            console.error('Erro ao carregar resumo:', error);
            this.loading = false;
          }
        });
    }
  }

  carregarPagamentos() {
    this.service.listaPagamentos(this.data_group.value.Sstart, this.data_group.value.Send).subscribe({
      next: (data) => {
        this.listaPagamentos = data;
        console.log('Pagamentos carregados:', data);
        this.pagamentosPendentes = data.filter((p: any) => p.status_pagamento === 'pendente');
      },
      error: (error) => {
        console.error('Erro ao carregar pagamentos:', error);
      }
    });
  }

  carregarDespesas() {
    this.service.listaDespesas().subscribe({
      next: (data) => {
        this.listaDespesas = data;
        console.log('Despesas carregadas:', data);
      },
      error: (error) => {
        console.error('Erro ao carregar despesas:', error);
      }
    });
  }

  carregarVendas() {
    this.service.listaVendas(this.data_group.value.Sstart, this.data_group.value.Send).subscribe({
      next: (data) => {
        this.listaVendas = data;
        console.log('Vendas carregadas:', data);
      },
      error: (error) => {
        console.error('Erro ao carregar vendas:', error);
      }
    });
  }

  carregarClientesAtivos() {
    // Assumindo que você tenha um método no serviço para buscar clientes ativos
    // Se não tiver, você pode adicionar no backend
    this.clienteService.pesquisar?.()?.subscribe({
      next: (data) => {
        console.log(data);
        this.clientesAtivos = data.filter((cliente: { status: string; }) => cliente.status === 'ativo').length;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes ativos:', error);

      }
    });
  }

  calcularMargemLucro() {
    if (this.resumo) {
      const receitaTotal = (this.resumo.total_pagamentos || 0) + (this.resumo.total_vendas || 0);
      if (receitaTotal > 0) {
        this.margemLucro = ((this.resumo.lucro_liquido || 0) / receitaTotal) * 100;
      } else {
        this.margemLucro = 0;
      }
    }
  }

  abrirModal(id: number) {
    const dialogRef = this.dialog.open(ModalVendaComponent, {
      width: '400px',
      data: { pagamento: this.listaPagamentos.filter(p => p.id == id), tipo: 'pagplano' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.confirmado) {
        this.aprovarPagamento(id, result.pagamento);
      }
    });
  }

  calcularPercentual(valor: number, total: number): string {
    if (!total || total === 0) return '0';
    return ((valor / total) * 100).toFixed(1);
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pago': 'Pago',
      'success': 'Pago',
      'pendente': 'Pendente',
      'cancelado': 'Cancelado',
      'cancel': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  gerarPDF() {
    this.service.gerarPdfMensal(this.mes.toString().padStart(2, '0'), this.ano.toString());
  }

  // Métodos para atualização de status dos pagamentos
  aprovarPagamento(pagamentoId: number, formaPag: string) {
    const dados = {
      id: pagamentoId,
      forma_pagamento: formaPag
    };

    this.service.updatePagamento(JSON.stringify(dados)).subscribe({
      next: (response) => {
        console.log('Pagamento aprovado:', response);
        this.carregarPagamentos();
        this.carregarResumo();
      },
      error: (error) => {
        console.error('Erro ao aprovar pagamento:', error);
      }
    });
  }

  cancelarPagamento(pagamentoId: number) {
    const dados = {
      cliente_id: pagamentoId,
      status_pagamento: 'cancel'
    };

    this.service.updatePagamento(dados).subscribe({
      next: (response) => {
        console.log('Pagamento cancelado:', response);
        this.carregarPagamentos();
        this.carregarResumo();
      },
      error: (error) => {
        console.error('Erro ao cancelar pagamento:', error);
      }
    });
  }

  // Método para filtrar dados por período
  filtrarPorPeriodo() {
    this.carregarResumo();
    // Recarregar as listas se as abas estiverem ativas
    if (this.listaPagamentos.length > 0) {
      this.carregarPagamentos();
    }
    if (this.listaDespesas.length > 0) {
      this.carregarDespesas();
    }
    if (this.listaVendas.length > 0) {
      this.carregarVendas();
    }
  }

  // Método para obter o nome do mês
  getNomeMes(numeroMes: number): string {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[numeroMes - 1] || '';
  }

  // Método para calcular evolução mensal (implementar se necessário)
  calcularEvolucao(): { tipo: 'positiva' | 'negativa', percentual: number } {
    // Lógica para calcular a evolução comparando com o mês anterior
    // Por enquanto, retorna um valor mock
    return {
      tipo: this.resumo?.lucro_liquido >= 0 ? 'positiva' : 'negativa',
      percentual: Math.abs(Math.random() * 15) // Mock - implementar lógica real
    };
  }

  // Método para destacar alertas importantes
  getAlertasFinanceiros() {
    // const alertas = [];

    if (this.resumo?.lucro_liquido < 0) {
      this.alertasFinanceiros.push({
        tipo: 'danger' as const,
        mensagem: 'Resultado negativo. Revise as despesas urgentemente.'
      });
    }

    if (this.pagamentosPendentes.length > 0) {
      this.alertasFinanceiros.push({
        tipo: 'warning' as const,
        mensagem: `${this.pagamentosPendentes.length} pagamento(s) pendente(s).`
      });
    }

    if (this.resumo?.total_despesas > (this.resumo?.total_pagamentos + this.resumo?.total_vendas) * 0.8) {
      this.alertasFinanceiros.push({
        tipo: 'warning' as const,
        mensagem: 'Despesas muito altas em relação às receitas.'
      });
    }

    if (this.clientesAtivos < 5) {
      this.alertasFinanceiros.push({
        tipo: 'info' as const,
        mensagem: 'Poucos clientes ativos. Considere campanhas de marketing.'
      });
    }
    console
  }

  selectPeriodo() {
    if (this.data_group.valid) {
      this.data_group.patchValue({
        Sstart: this.datePipe.transform(this.data_group.value.start, 'yyyy-MM-dd'),
        Send: this.datePipe.transform(this.data_group.value.end, 'yyyy-MM-dd')
      })

      console.log('Período completo selecionado!');
      console.log('Data de Início:', this.data_group.value.Sstart);
      console.log('Data de Fim:', this.data_group.value.Send);

      this.atualizarTodosDados();
    }
  }

  // Método para resetar filtros
  resetarFiltros() {
    this.mes = new Date().getMonth() + 1;
    this.ano = new Date().getFullYear();
    this.carregarResumo();
  }

  onDatePicked(event: { startDate: moment.Moment, endDate: moment.Moment }) {
    console.log('Datas selecionadas:', event.startDate.format('YYYY-MM-DD'), 'até', event.endDate.format('YYYY-MM-DD'));
     this.data_group.patchValue({
        Sstart: event.startDate.format('YYYY-MM-DD'),
        Send: event.endDate.format('YYYY-MM-DD')
      })
     this.atualizarTodosDados();
  }


  // Método para atualizar todos os dados
  atualizarTodosDados() {
    this.carregarResumo();
    this.carregarPagamentos();
    this.carregarDespesas();
    this.carregarVendas();
    this.carregarClientesAtivos();
  }
}