import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
   providedIn: 'root'
})
export class PnFinanceiroService {
   private apiurl = environment.apiUrl + '/Financeiro';
   private urlR = environment.apiUrl + '/Relatorios/financeiro';
   private url = 'http://localhost/sites/Projeto1/Back-end/public/Financeiro/create'
   private urlP = 'http://localhost/sites/Projeto1/Back-end/public/Financeiro/pesquisar'
   private urlResumo = 'http://localhost/sites/Projeto1/Back-end/public/Financeiro/resumo'
   private urlPendente = 'http://localhost/sites/Projeto1/Back-end/public/Financeiro/pesquisarCliPendente'
   private urlUP = 'http://localhost/sites/Projeto1/Back-end/public/Financeiro/update'
   private urlGP = 'http://localhost/sites/Projeto1/Back-end/public/StripeController/getPagamentos'

   constructor(private http: HttpClient, private router: Router) { }

   cadastrar(dados: any): Observable<any> {
      return this.http.post<any>(this.url, dados);
   }
   pesquisar(dados: any): Observable<any> {
      return this.http.post<any>(this.urlP, dados);
   }
   pesquisarCliPendente(): Observable<any> {
      return this.http.get<any>(this.urlPendente);
   }
   update(dados: any): Observable<any> {
      return this.http.post<any>(this.urlUP, dados);
   }
   //   getPagamentos(): Observable<any>{
   //    return this.http.get<any>(this.urlGP);
   // }

   gerarPdf(mes: string, ano: string) {
      window.open(`http://localhost/sites/Projeto1/Back-end/public/Relatorios/financeiro?mes=${mes}&ano=${ano}`, '_blank');

   }

   getResumo(mes: string, ano: string): Observable<any> {
      return this.http.get<any>(this.urlResumo + `?mes=${mes}&ano=${ano}`);
   }

   getPagamentos() {
      return this.http.get(`${this.apiurl}/pagamentos`);
   }

   getDespesas() {
      return this.http.get(`${this.apiurl}/despesas`);
   }

   getVendas() {
      return this.http.get(`${this.apiurl}/vendas`);
   }
}
