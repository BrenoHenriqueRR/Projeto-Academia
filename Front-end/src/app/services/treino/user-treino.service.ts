import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
// import { TreinoItem } from '../../interfaces/treino-item';
// import { Treinos } from '../../interfaces/treinos';

@Injectable({
  providedIn: 'root'
})
export class UserTreinoService {
  url_pesquisar: string = environment.apiUrl + "/Treino/pesquisar";

  constructor(private http: HttpClient) { }

  pesquisar(data: any): Observable<any> {
    const id = data;
    return this.http.post<any>(this.url_pesquisar,id); 
  }

  
}
