import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formresponse } from '../../interfaces/formresponse';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = environment.apiUrl +'Cliente/login' 
  private url_id = environment.apiUrl +'Cliente/pesquisarid' ;
   

  constructor(private http: HttpClient) {} 

     sendData(dados: any)
     : Observable<any> {
      const data = dados;
      // console.log(data);

      return this.http.post<any>(this.url, data);
    }

    pesquisar(email:any){
      return this.http.post<any>(this.url_id, email);
    }
  }

