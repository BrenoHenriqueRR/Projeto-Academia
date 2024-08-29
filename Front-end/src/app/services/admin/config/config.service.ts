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
  private url_createPlanos = apiurl + '/Planos/create'
  private url_pesquisar = apiurl + '/Academia/read'
  private url_pesquisarAcademia = apiurl + '/Academia/readAcademia'
  private url_nextstep = apiurl + '/Academia/nextStep'
  private url_pesquisarPlanos = apiurl + '/Planos/read'
  constructor(private http: HttpClient) { }

  create(dados: any):Observable<any>{
    const data = dados;
    return this.http.post<any>(this.url_createconfig, data);
  }

  createPlanos(dados: any):Observable<any>{
    const data = dados;
    return this.http.post<any>(this.url_createPlanos, data);
  }
  
  pesquisar():Observable<any>{
    return this.http.get<any>(this.url_pesquisar);
  }

  pesquisarAcademia():Observable<any>{
    return this.http.get<any>(this.url_pesquisarAcademia);
  }
  
  pesquisarPlanos():Observable<any>{
    return this.http.get<any>(this.url_pesquisarPlanos);
  }
  
  updateEtapa(data:any):Observable<any>{
    return this.http.post<any>(this.url_nextstep, data);
  }
}
