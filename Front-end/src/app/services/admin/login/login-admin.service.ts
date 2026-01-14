import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { formresponse } from '../../../interfaces/formresponse';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginAdminService {
  private url = environment.apiUrl + 'Admin/login' 
  private url_pesquisar = environment.apiUrl + 'Admin/funcao' 
  private url_pesquisar2 = environment.apiUrl + 'Admin/funcaoPncli' 

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
