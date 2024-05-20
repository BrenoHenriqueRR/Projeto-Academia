import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FuncionarioPesquisar } from '../../../interfaces/funcionario-pesquisar';

@Injectable({
  providedIn: 'root'
})
export class PnFuncionarioService {

  private url = 'http://localhost/sites/Projeto1/Back-end/public/adm/funpesquisar';

  constructor(private http: HttpClient) {} 

  pesquisar(): Observable<FuncionarioPesquisar> {
    return this.http.get<FuncionarioPesquisar>(this.url);
  }
}
