
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PnRelatoriosService {
  urlE: string = environment.apiUrl + "Relatorios/rEstatistica";

  constructor(private http: HttpClient) { }

  pesquisarEstatisticas(id: any): Observable<any> {
    return this.http.post<any>(this.urlE,id);
  }

  
}