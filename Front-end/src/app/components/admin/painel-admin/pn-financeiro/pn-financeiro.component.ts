import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { PnFinanceiroService } from '../../../../services/admin/pn-financeiro/pn-financeiro.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pn-financeiro',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './pn-financeiro.component.html',
  styleUrl: './pn-financeiro.component.css'
})
export class PnFinanceiroComponent {
  // Propriedades existentes
  mes = new Date().getMonth() + 1;
  ano = new Date().getFullYear();
  resumo: any;

  // Novas propriedades para funcionalidades avançadas
  listaPagamentos: any[] = [];
  alertasFinanceiros: Array<{tipo: 'warning' | 'danger' | 'info', mensagem: string}> = [];
  listaDespesas: any[] = [];
  listaVendas: any[] = [];
  pagamentosPendentes: any[] = [];
  clientesAtivos: number = 0;
  margemLucro: number = 0;
  loading = false;

  // Dados para gráficos (pode ser expandido futuramente)
  dadosGrafico = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    receitas: [1200, 1500, 1800, 1600, 367],
    despesas: [800, 900, 1200, 1100, 20000]
  };

  constructor(
    private service: PnFinanceiroService,
    private clienteService: PnClienteService
  ) {}

  ngOnInit(): void {
    this.carregarResumo();
    this.carregarClientesAtivos();
    this.carregarPagamentos();
  }

  carregarResumo() {
    this.loading = true;
    this.service.getResumo(this.mes.toString().padStart(2, '0'), this.ano.toString())
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
  }

  carregarPagamentos() {
    this.service.listaPagamentos().subscribe({
      next: (data) => {
        this.listaPagamentos = data;
        this.pagamentosPendentes = data.filter((p: any) => p.status_pagamento === 'pendente');
        console.log('Pagamentos carregados:', data);
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
    this.service.listaVendas().subscribe({
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

  // exportarExcel() {
  //   // Implementar exportação para Excel
  //   const dadosExportacao = {
  //     resumo: this.resumo,
  //     pagamentos: this.listaPagamentos,
  //     despesas: this.listaDespesas,
  //     vendas: this.listaVendas,
  //     periodo: `${this.mes}/${this.ano}`
  //   };
    
  //   console.log('Exportando dados para Excel:', dadosExportacao);
  //   // Aqui você pode implementar a lógica de exportação
  //   // Por exemplo, usando uma biblioteca como xlsx
  // }

  // Métodos para atualização de status dos pagamentos
  aprovarPagamento(pagamentoId: number) {
    const dados = {
      cliente_id: pagamentoId,
      status_pagamento: 'success'
    };

    this.service.updatePagamento(dados).subscribe({
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
  getAlertasFinanceiros(){
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

  // Método para resetar filtros
  resetarFiltros() {
    this.mes = new Date().getMonth() + 1;
    this.ano = new Date().getFullYear();
    this.carregarResumo();
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