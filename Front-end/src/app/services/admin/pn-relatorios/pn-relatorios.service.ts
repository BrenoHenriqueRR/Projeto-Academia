
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PnRelatoriosService {
  urlE: string = "http://localhost/sites/Projeto1/Back-end/public/Relatorios/rEstatistica";

  constructor(private http: HttpClient) { }

  pesquisarEstatisticas(id: any): Observable<any> {
    return this.http.post<any>(this.urlE,id);
  }

  
}