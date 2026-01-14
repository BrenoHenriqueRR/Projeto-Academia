import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formresponse } from '../../interfaces/formresponse';
import { CliPesquisar } from '../../interfaces/cli-pesquisar';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModalEditarService {
  url_cliente: string = environment.apiUrl + 'Admin/editar';
  url_pesquisar: string = environment.apiUrl + 'Admin/buscar';
  url_funcionario: string = environment.apiUrl + 'Admin/buscarfuncionario'
  url_editfuncionario: string = environment.apiUrl + 'Admin/editfuncionario'

  constructor(private http: HttpClient) { }

  editar(dados: any)
    : Observable<formresponse> {
    const data = dados;

    return this.http.post<formresponse>(this.url_cliente, data);
  }

  editarfun(dados: any): Observable<any> {
    const data = dados;
    return this.http.post<any>(this.url_editfuncionario, data);
  }

  pesquisar(identificador: any): Observable<any> {
    return this.http.post<any>(this.url_pesquisar, identificador);
  }
  
  pesquisarP(identificador: any): Observable<any> {
    return this.http.post<any>(this.url_funcionario, identificador);
  }
}
