import { Component } from '@angular/core';
import { UserTreinoService } from '../../../services/treino/user-treino.service';
import { PnFinanceiroService } from '../../../services/admin/pn-financeiro/pn-financeiro.service';

@Component({
  selector: 'app-dashboard-cli',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-cli.component.html',
  styleUrl: './dashboard-cli.component.css'
})
export class DashboardCliComponent {
  treino!: any;
  pagamentos!: any;

  constructor(private Streino:UserTreinoService, private sPagamento: PnFinanceiroService){

    this.pesquisarTreino();
    this.pesquisarpag();
  }

  pesquisarpag() {
    const idjson: string = '{"cliente_id": "' + localStorage.getItem('idcliente') + '"}';
    this.sPagamento.pesquisar(idjson).subscribe({
      next:(dados ) =>{
        this.pagamentos = dados;

        for (let index = 0; index < dados.length; index++) {
          this.pagamentos[index].data_criacao = this.pagamentos[index].data_criacao.split(" ")[0];
        }
      },
    })
  }
  pesquisarTreino(){
    const jsonString: string = '{"cliente_id": "' + localStorage.getItem('idcliente') + '"}';
    this.Streino.pesquisar(jsonString).subscribe({
      next:(dados) =>{
        if(dados){
        this.treino = dados;
      }
      }
    });
  }
}
