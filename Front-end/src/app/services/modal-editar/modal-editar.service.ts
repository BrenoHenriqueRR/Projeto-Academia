import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formresponse } from '../../interfaces/formresponse';
import { CliPesquisar } from '../../interfaces/cli-pesquisar';

@Injectable({
  providedIn: 'root'
})
export class ModalEditarService {
  url_cliente: string = 'http://localhost/sites/Projeto1/Back-end/public/Admin/editar';
  url_pesquisar: string = 'http://localhost/sites/Projeto1/Back-end/public/Admin/buscar';

  constructor(private http: HttpClient) {}
  
    editar(dados: any)
    : Observable<formresponse> {
     const data = dados;

     return this.http.post<formresponse>(this.url_cliente, data);
  }

  pesquisar(identificador: any): Observable<CliPesquisar> {
    return this.http.post<CliPesquisar>(this.url_pesquisar, identificador); 
  }
}
