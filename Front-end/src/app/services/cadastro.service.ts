import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formresponse } from '../interfaces/formresponse';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
   private url = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/create' 
   

  constructor(private http: HttpClient) {} 

     sendData(dados: any)
     : Observable<formresponse> {
      const data = dados;
      // console.log(data);

      return this.http.post<formresponse>(this.url, data);
  }
}
