import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formresponse } from '../../interfaces/formresponse';
import { environment } from '../../../environments/environment';

var apiurl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class CadTreinoService {
  private url_treino = apiurl + '/Treino/create'
  private url_exer = apiurl + '/Treino/cadexer'
  private url_grupo = apiurl + '/Treino/cadgrupo'
  private url_ptipo = apiurl + '/Treino/ptipo'
  private url_pgrupo = apiurl + '/Treino/pgrupo'
  private url_pexer = apiurl + '/Treino/pexer'

  constructor(private http: HttpClient) {} 

     enviar(dados: any)
     : Observable<formresponse> {
      const data = dados;
      console.log(data);

      return this.http.post<formresponse>(this.url_treino, data);

      
  }
  cadgrupo(data: any): Observable<any> {
    return this.http.post<any>(this.url_grupo,data); 
  }
  cadexer(data: any): Observable<any> {
    return this.http.post<any>(this.url_exer,data);
  }
  ptipo(): Observable<any> {
    return this.http.get<any>(this.url_ptipo);
  }
  pgrupo(): Observable<any> {
    return this.http.get<any>(this.url_pgrupo);
  }
  pexer(): Observable<any> {
    return this.http.get<any>(this.url_pexer);
  }
  
}
