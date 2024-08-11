import { Component, inject } from '@angular/core';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { PnFinanceiroService } from '../../../../services/admin/pn-financeiro/pn-financeiro.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [RouterLink]
})
export class DashboardComponent {
  total: any;
  cliPendente: any;

  constructor(private service: PnClienteService,private cadservice: PnFinanceiroService){
    this.pesquisarCliPendente();
      this.cadservice.getPagamentos().subscribe({
        next: (total) => {
          this.total = total[0].preco;
        },
      })
  }


  pesquisarCliPendente(){
    this.cadservice.pesquisarCliPendente().subscribe(
      (dado) => {
        // console.log('Dados recebidos:', dado);
        this.cliPendente = dado;
        
      },
      (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }
}
