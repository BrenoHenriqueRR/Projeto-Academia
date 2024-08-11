import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

var apiurl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private url_createconfig = apiurl + '/Academia/create'
  private url_pesquisar = apiurl + '/Academia/pesquisar'
  constructor(private http: HttpClient) { }

  create(dados: any):Observable<any>{
    const data = dados;
    return this.http.post<any>(this.url_createconfig, data);
  }

  pesquisar():Observable<any>{
    return this.http.get<any>(this.url_pesquisar);
  }
}
