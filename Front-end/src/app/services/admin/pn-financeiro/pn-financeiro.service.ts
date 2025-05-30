import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
   providedIn: 'root'
})
export class PnFinanceiroService {
   private apiUrl = `${environment.apiUrl}/Financeiro`;

  constructor(private http: HttpClient) { }

  // Método existente
  getResumo(mes: string, ano: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/resumo?mes=${mes}&ano=${ano}`);
  }

  // Novos métodos para as funcionalidades melhoradas
  listaPagamentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listaPagamentos`);
  }

  listaDespesas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listaDespesas`);
  }

  listaVendas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listaVendas`);
  }

  // Método para buscar pagamentos pendentes
  getPagamentosPendentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pesquisarCliPendente`);
  }

  // Método para atualizar status de pagamento
  updatePagamento(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, dados);
  }

  // Método para buscar dados de um cliente específico
  pesquisarPagamentosCliente(clienteId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/pesquisar`, { cliente_id: clienteId });
  }

  // Método existente
  gerarPdfMensal(mes: string, ano: string): void {
    const url = `${this.apiUrl}/gerarRelatorioMensalPdf?mes=${mes}&ano=${ano}`;
    window.open(url, '_blank');
  }

  // Novos métodos para relatórios
  gerarRelatorioCompleto(mes: string, ano: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/relatorioCompleto?mes=${mes}&ano=${ano}`, {
      responseType: 'blob'
    });
  }

  exportarExcel(dados: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/exportarExcel`, dados, {
      responseType: 'blob'
    });
  }

  // Método para obter estatísticas mensais comparativas
  getEstatisticasComparativas(ano: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/estatisticasComparativas?ano=${ano}`);
  }

  // Método para obter previsões (se implementado no backend)
  getPrevisoes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/previsoes`);
  }

}
