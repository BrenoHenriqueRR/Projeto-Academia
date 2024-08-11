import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FuncionarioPesquisar } from '../../../interfaces/funcionario-pesquisar';

@Injectable({
  providedIn: 'root'
})
export class PnFuncionarioService {

  private url = 'http://localhost/sites/Projeto1/Back-end/public/Admin/buscarfun';
  private urldel = 'http://localhost/sites/Projeto1/Back-end/public/Admin/deletefun ';

  constructor(private http: HttpClient) {} 

  pesquisar(): Observable<FuncionarioPesquisar> {
    return this.http.get<FuncionarioPesquisar>(this.url);
  }
  delete(id: any): Observable<any> {
    return this.http.post<any>(this.urldel, id);
  }
}
