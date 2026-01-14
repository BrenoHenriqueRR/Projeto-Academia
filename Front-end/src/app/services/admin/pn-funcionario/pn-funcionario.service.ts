import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FuncionarioPesquisar } from '../../../interfaces/funcionario-pesquisar';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PnFuncionarioService {
  apiurl = environment.apiUrl;

  private url = environment.apiUrl + 'Admin/buscarfun';
  private urldel = environment.apiUrl + 'Admin/deletefun';
  private urlcreate = environment.apiUrl + 'Funcionarios/create';

  constructor(private http: HttpClient) {} 

  create(dados: FormData): Observable<any> {
    return this.http.post<FuncionarioPesquisar>(this.urlcreate, dados);
  }

  pesquisar(): Observable<FuncionarioPesquisar> {
    return this.http.get<FuncionarioPesquisar>(this.url);
  }
  delete(id: any): Observable<any> {
    return this.http.post<any>(this.urldel, id);
  }

}
