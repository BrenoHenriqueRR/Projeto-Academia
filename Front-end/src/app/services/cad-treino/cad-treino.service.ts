import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formresponse } from '../../interfaces/formresponse';

@Injectable({
  providedIn: 'root'
})
export class CadTreinoService {
  private url_treino = 'http://localhost/sites/Projeto1/Back-end/public/Treino/create';
  constructor(private http: HttpClient) {} 

     enviar(dados: any)
     : Observable<formresponse> {
      const data = dados;
      console.log(data);

      return this.http.post<formresponse>(this.url_treino, data);
  }
}
