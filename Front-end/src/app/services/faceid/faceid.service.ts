import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FaceidService {
  private url_create = 'http://localhost/sites/Projeto1/Back-end/public/Faceid/create';
  private url_comparar = 'http://localhost/sites/Projeto1/Back-end/public/Faceid/verificarFaceId';

  constructor(private http: HttpClient) {} 

  create(foto: any) : Observable<any>{
    const base64 = foto;
    return this.http.post<any>(this.url_create,base64);
  }

  comparar(foto: any) : Observable<any>{
    const base64 = foto;
    return this.http.post<any>(this.url_comparar,base64);
  }
}
