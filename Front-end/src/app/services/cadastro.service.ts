import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formresponse } from '../interfaces/formresponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
   private url_cliente = environment.apiUrl + '/Cliente/create';
   private url_createC = environment.apiUrl + '/Cliente/createComplete';
   private url_pesquisar = environment.apiUrl + '/Funcionarios/pesquisar';
   

  constructor(private http: HttpClient) {} 

      sendData(dados: any)
     : Observable<formresponse> {
      const data = dados;
      // console.log(data);

      return this.http.post<formresponse>(this.url_cliente, data);
  }

  createComplete(dados: FormData): Observable<any> {
    return this.http.post<any>(this.url_createC,dados);
  }

  pesquisar(): Observable<any> {
    return this.http.get<any>(this.url_pesquisar); // Substitua 'any' pelo tipo de dados esperado
  }
}
