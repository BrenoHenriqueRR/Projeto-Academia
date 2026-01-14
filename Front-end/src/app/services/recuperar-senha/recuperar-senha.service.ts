import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecuperarSenhaService {
  url: string = environment.apiUrl +'EmailController/create';
  urlS: string = environment.apiUrl + 'Cliente/trocarSenha';
  constructor(private http: HttpClient) {} 

  enviarMail(email: any): Observable<any> {
    return this.http.post<any>(this.url, email); 
  }
  trocarSenha(senha: any): Observable<any> {
    return this.http.post<any>(this.urlS, senha); 
  }

}
