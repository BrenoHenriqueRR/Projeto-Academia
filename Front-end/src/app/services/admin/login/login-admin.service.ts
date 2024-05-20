import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { formresponse } from '../../../interfaces/formresponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginAdminService {
  private url = 'http://localhost/sites/Projeto1/Back-end/public/Admin/login' 
  private url_pesquisar = 'http://localhost/sites/Projeto1/Back-end/public/Admin/funcao' 
  private url_pesquisar2 = 'http://localhost/sites/Projeto1/Back-end/public/Admin/funcaoPncli' 

  constructor(private http: HttpClient) {} 

     sendData(dados: any)
     : Observable<formresponse> {
      const data = dados;

      return this.http.post<formresponse>(this.url, data);
    }

    funcao(email: any ):Observable<any> {
      return this.http.post<any>(this.url_pesquisar,email);

    }
    funcaoCliente(id: any ):Observable<any> {
      return this.http.post<any>(this.url_pesquisar2,id);

    }
    
}
