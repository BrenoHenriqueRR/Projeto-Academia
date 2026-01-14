import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PnLojaService {
  private urlR = environment.apiUrl + "Loja/read";
  private urlVenda = environment.apiUrl + "Loja/createSale";
  private urlProduto = environment.apiUrl + "Loja/create";
  private urlProdutoE = environment.apiUrl + "Loja/editProduto";
  private urlProdutoD = environment.apiUrl + "Loja/deleteProduto";


  constructor(private http: HttpClient) { }

  read(): Observable<any> {
    console.log(this.urlR)
    return this.http.get<any>(this.urlR);
  }

  createV(dados: any): Observable<any> {
    return this.http.post(this.urlVenda, dados);
  }

  createP(dados: any): Observable<any> {
    return this.http.post(this.urlProduto, dados);
  }

  editarP(dados: any): Observable<any> {
    return this.http.post(this.urlProdutoE, dados);
  }

  deleteP(id: any): Observable<any> {
    return this.http.post(this.urlProdutoD, id);
  }
}
