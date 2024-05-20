import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formresponse } from '../../interfaces/formresponse';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/login' 
  private url_id = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/pesquisarid' ;
   

  constructor(private http: HttpClient) {} 

     sendData(dados: any)
     : Observable<formresponse> {
      const data = dados;
      // console.log(data);

      return this.http.post<formresponse>(this.url, data);
    }

    pesquisar(email:any){
      return this.http.post<any>(this.url_id, email);
    }
  }

