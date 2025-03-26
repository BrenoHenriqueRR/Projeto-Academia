import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnamneseService {
  private urlCreate = environment.apiUrl + '/Anamnese/create'
  private urlRead = environment.apiUrl + '/Anamnese/read'
  private urlDelete = environment.apiUrl + '/Anamnese/deleteAnamnese'

  constructor(private http: HttpClient) { }

  create(dados: any): Observable<any> {
    const data = dados;
    // console.log(data);
    return this.http.post<any>(this.urlCreate, data);
  }

  read(): Observable<any> {
    return this.http.get<any>(this.urlRead); 
  }

  delete(id: any): Observable<any> {
    return this.http.post<any>(this.urlDelete, id); 
  }

}
