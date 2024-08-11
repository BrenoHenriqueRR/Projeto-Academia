import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PnFinanceiroService {
  private url = 'http://localhost/sites/Projeto1/Back-end/public/Financeiro/create'
  private urlP = 'http://localhost/sites/Projeto1/Back-end/public/Financeiro/pesquisar'
  private urlPendente = 'http://localhost/sites/Projeto1/Back-end/public/Financeiro/pesquisarCliPendente'
  private urlUP = 'http://localhost/sites/Projeto1/Back-end/public/Financeiro/update'
  private urlGP = 'http://localhost/sites/Projeto1/Back-end/public/StripeController/getPagamentos'

  constructor(private http: HttpClient) {} 

  cadastrar(dados:any): Observable<any>{
     return this.http.post<any>(this.url,dados);
  }
  pesquisar(dados:any): Observable<any>{
     return this.http.post<any>(this.urlP,dados);
  }
  pesquisarCliPendente(): Observable<any>{
     return this.http.get<any>(this.urlPendente);
  }
  update(dados:any): Observable<any>{
     return this.http.post<any>(this.urlUP,dados);
  }
  getPagamentos(): Observable<any>{
   return this.http.get<any>(this.urlGP);
}
}
