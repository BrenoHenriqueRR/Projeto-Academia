import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CliPesquisar } from '../../../interfaces/cli-pesquisar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PnClienteService {
  private url = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/pesquisar';

  constructor(private http: HttpClient) {} 

  pesquisar(): Observable<CliPesquisar> {
    return this.http.get<CliPesquisar>(this.url);
  }
}
