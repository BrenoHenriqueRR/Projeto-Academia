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
  private url_Pagamento = 'http://localhost/sites/Projeto1/Back-end/public/ClientePlanos/concluirPagamento';
  private url_pdfstatus = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/relatorioClientesStatus';
  private url_pdfpagamentos = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/relatorioClientesPagamentos';
  private url_pdfpresenca = 'http://localhost/sites/Projeto1/Back-end/public/Cliente/gerarRelatorioPresenca';


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
