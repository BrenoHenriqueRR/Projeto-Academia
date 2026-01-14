import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FichaService {
  private url = environment.apiUrl + 'Ficha/create' 

  constructor(private http: HttpClient) { }

  create(dados:any){
    return this.http.post<any>(this.url, dados);
  }
}
