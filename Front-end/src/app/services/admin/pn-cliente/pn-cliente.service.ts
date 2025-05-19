import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CliPesquisar } from '../../../interfaces/cli-pesquisar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PnClienteService {
  private url = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/pesquisar';
  private urlSAnam = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/getClientesSemAnamnese';
  private urlpag = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/pesquisarPag';
  private urlpid = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/pesquisarpid';
  private urldel = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/delete';
  private urlFoto = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/inserirFoto';
  private urlgetFoto = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/pegarFoto';
  private url_Planosid = 'http://localhost/sites/Projeto1/Back-end/public/ClientePlanos/pesquisarId';
  

  constructor(private http: HttpClient) {} 

  pesquisar(): Observable<CliPesquisar> {
    return this.http.get<CliPesquisar>(this.url);
  }

  pesquisarSAnam(): Observable<CliPesquisar> {
    return this.http.get<CliPesquisar>(this.urlSAnam);
  }
 
  pesquisarpid(id:any): Observable<any> {
    return this.http.post<any>(this.urlpid, id);
  }

  delete(id: any): Observable<any>{
    return this.http.post<any>(this.urldel,id)
  }

  inserirfoto(imagem: FormData): Observable<any>{
    return this.http.post<any>(this.urlFoto,imagem)
  }

  pegarfoto(id: any): Observable<any>{
    return this.http.post<any>(this.urlgetFoto,id)
  }

  listarTodosPag():Observable<any> {
    return this.http.get<any>(this.urlpag);
  }

  pesquisarIdPlano(id: any): Observable<any>{
    return this.http.post<any>(this.url_Planosid,id)
  }
}
