import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PnFinanceiroService {
  url: any = 'http://localhost/sites/Projeto1/Back-end/public/Financeiro/create'

  constructor(private http: HttpClient) {} 

  cadastrar(dados:any): Observable<any>{
     return this.http.post<any>(this.url,dados);
  }
}
