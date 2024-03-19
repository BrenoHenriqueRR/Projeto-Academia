import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formresponse } from '../interfaces/formresponse';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
   private url = 'http://localhost:8000/public/Cliente/create' 
   

  constructor(private http: HttpClient) {} 

    sendData(nome: string, email: string, senha: string, endereco: string)
     : Observable<formresponse> {
      const data = {nome, email,senha,endereco};

      return this.http.post<formresponse>(this.url, data);
  }
}
