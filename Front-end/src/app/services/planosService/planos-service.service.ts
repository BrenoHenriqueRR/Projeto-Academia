import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

var apiurl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class PlanosServiceService {
  url_edit = apiurl + "/Planos/edit";
  constructor(private http: HttpClient) { }

  editar(dados: any):Observable<any>{
    return this.http.post<any>(this.url_edit, dados);
  }


  
}
