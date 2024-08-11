import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuperarSenhaService {
  url: string = 'http://localhost/sites/Projeto1/Back-end/public/EmailController/create';
  urlS: string = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/trocarSenha';
  constructor(private http: HttpClient) {} 

  enviarMail(email: any): Observable<any> {
    return this.http.post<any>(this.url, email); 
  }
  trocarSenha(senha: any): Observable<any> {
    return this.http.post<any>(this.urlS, senha); 
  }

}
