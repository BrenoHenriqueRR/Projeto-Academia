import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { TreinoItem } from '../../interfaces/treino-item';
import { Treinos } from '../../interfaces/treinos';

@Injectable({
  providedIn: 'root'
})
export class UserTreinoService {
  url_pesquisar: string = "http://localhost/sites/Projeto1/Back-end/public/Treino/pesquisar";

  constructor(private http: HttpClient) { }

  pesquisar(data: any): Observable<any> {
    return this.http.post<Treinos>(this.url_pesquisar,data); // Substitua 'any' pelo tipo de dados esperado
  }

  
}
