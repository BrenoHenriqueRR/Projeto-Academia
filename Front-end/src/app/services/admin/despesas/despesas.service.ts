import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface Despesa {
id?: number;
  descricao: string;
  valor: number;
  tipo: 'fixa' | 'variável';
  data: string;
  observacao?: string;
  status: 'paga' | 'pendente';
}

@Injectable({
  providedIn: 'root'
})

export class DespesasService {
  private urlc = environment.apiUrl + '/Despesas/create';
  private urlr = environment.apiUrl + '/Despesas/read';
  private urlu = environment.apiUrl + '/Despesas/update';
  private urld = environment.apiUrl + '/Despesas/delete';
  private urlri = environment.apiUrl + '/Despesas/readId';

  constructor(private http: HttpClient) {}

  create(despesa: any) : Observable<Despesa>{
    return this.http.post<Despesa>(this.urlc, despesa);
  }

  read(): Observable<any>{
    return this.http.get<Despesa[]>(this.urlr);
  }

  update(dados : any) : Observable<any>{
    return this.http.post(this.urlu, dados);
  }

  delete(id: any) : Observable<any>{
    return this.http.post(this.urld,id);
  }

  readId(id: any) : Observable<any>{
    return this.http.post<Despesa>(this.urlri, id);
  }
}
