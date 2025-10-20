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
  private url_pin =  `${environment.apiUrl}/Faceid/presencaPorPin`;

  constructor(private http: HttpClient) {} 

  create(foto: any) : Observable<any>{
    const base64 = foto;
    return this.http.post<any>(this.url_create,base64);
  }

  comparar(foto: any) : Observable<any>{
    const base64 = foto;
    return this.http.post<any>(this.url_comparar,base64);
  }

  enviarPresenca(pin: string): Observable<any> {
    return this.http.post<any>(this.url_pin, { pin });
  }
}
