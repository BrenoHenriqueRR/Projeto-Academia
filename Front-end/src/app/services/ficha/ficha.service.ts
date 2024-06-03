import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FichaService {
  private url = 'http://localhost/sites/Projeto1/Back-end/public/Ficha/create' 

  constructor(private http: HttpClient) { }

  create(dados:any){
    return this.http.post<any>(this.url, dados);
  }
}
