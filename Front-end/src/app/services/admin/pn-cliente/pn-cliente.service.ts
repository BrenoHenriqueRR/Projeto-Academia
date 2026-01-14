import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CliPesquisar } from '../../../interfaces/cli-pesquisar';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PnClienteService {
  private url = environment.apiUrl + 'Cliente/pesquisar';
  private urlSAnam = environment.apiUrl + 'Cliente/getClientesSemAnamnese';
  private urlpag = environment.apiUrl + 'Cliente/pesquisarPag';
  private urlpid = environment.apiUrl + 'Cliente/pesquisarpid';
  private urldel = environment.apiUrl + 'Cliente/delete';
  private urlFoto = environment.apiUrl + 'Cliente/inserirFoto';
  private urlgetFoto = environment.apiUrl + 'Cliente/pegarFoto';
  private url_Planosid = environment.apiUrl + 'ClientePlanos/pesquisarId';
  private url_Pagamento = environment.apiUrl + 'ClientePlanos/concluirPagamento';
  private url_pdfstatus = environment.apiUrl + 'Cliente/relatorioClientesStatus';
  private url_pdfpagamentos = environment.apiUrl + 'Cliente/relatorioClientesPagamentos';
  private url_pdfpresenca = environment.apiUrl + 'Cliente/gerarRelatorioPresenca';
  private url_pdfpresencaindv = environment.apiUrl + 'Cliente/gerarRelatorioPresencaIndividual';


  constructor(private http: HttpClient) { }

  pesquisar(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  pesquisarSAnam(): Observable<CliPesquisar> {
    return this.http.get<CliPesquisar>(this.urlSAnam);
  }

  pesquisarpid(id: any): Observable<any> {
    return this.http.post<any>(this.urlpid, id);
  }

  delete(id: any): Observable<any> {
    return this.http.post<any>(this.urldel, id)
  }

  inserirfoto(imagem: FormData): Observable<any> {
    return this.http.post<any>(this.urlFoto, imagem)
  }

  pegarfoto(id: any): Observable<any> {
    return this.http.post<any>(this.urlgetFoto, id)
  }

  realizarPagamento(id: any): Observable<any> {
    return this.http.post<any>(this.url_Pagamento, id)
  }

  listarTodosPag(): Observable<any> {
    return this.http.get<any>(this.urlpag);
  }

  pesquisarIdPlano(id: any): Observable<any> {
    return this.http.post<any>(this.url_Planosid, id)
  }

  gerarRelatorioClientes(tipo: any): void {
    switch (tipo) {
      case 'status':
        this.gerarRelatorioClientesStatus();
        break;
      case 'pagamentos':
        this.gerarRelatorioClientesPagamentos();
        break;
      case 'presenca':
        // this.gerarRelatorioClientesPresenca();
        break;
    }
  }

  gerarRelatorioClientesPresencaId(dados: any): void  {
    window.open(`${this.url_pdfpresencaindv}?data_inicio=${dados.data_inicio}&data_fim=${dados.data_fim}&cliente_id=${dados.cliente_id}`, '_blank');
  }

  gerarRelatorioClientesStatus(): void {
    // const url = this.url_pdfstatus;
    window.open(this.url_pdfstatus, '_blank');
  }

  gerarRelatorioClientesPagamentos(): void {
    window.open(this.url_pdfpagamentos, '_blank');
  }
  
  gerarRelatorioClientesPresenca(data_inicio: string, data_fim: string): void {
    window.open(`${this.url_pdfpresenca}?data_inicio=${data_inicio}&data_fim=${data_fim}`, '_blank');
  }
}
