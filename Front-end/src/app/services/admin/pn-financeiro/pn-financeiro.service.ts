import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PnFinanceiroService {
  private url = 'http://localhost/sites/Projeto1/Back-end/public/Financeiro/create'
  private urlP = 'http://localhost/sites/Projeto1/Back-end/public/Financeiro/pesquisar'
  private urlUP = 'http://localhost/sites/Projeto1/Back-end/public/Financeiro/update'

  constructor(private http: HttpClient) {} 

  cadastrar(dados:any): Observable<any>{
     return this.http.post<any>(this.url,dados);
  }
  pesquisar(dados:any): Observable<any>{
     return this.http.post<any>(this.urlP,dados);
  }
  update(dados:any): Observable<any>{
     return this.http.post<any>(this.urlUP,dados);
  }
}
