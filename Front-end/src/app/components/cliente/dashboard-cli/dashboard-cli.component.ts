import { Component } from '@angular/core';
import { UserTreinoService } from '../../../services/treino/user-treino.service';
import { PnFinanceiroService } from '../../../services/admin/pn-financeiro/pn-financeiro.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-cli',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-cli.component.html',
  styleUrl: './dashboard-cli.component.css'
})
export class DashboardCliComponent {
  treinos!: any;
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
    const idjson: string = '{"cliente_id": "' + localStorage.getItem('idcliente') + '"}';
    console.log(idjson);
    this.Streino.pesquisar(idjson).subscribe({
      next:(dados) =>{
        if(!dados.msg){
        // this.treinos = dados;
        console.log(dados);
      }else{
        console.log("Nenhum treino cadastrado");
      }
      },error: (error) => {

        console.log('Erro na requisição:', error);
        if (error.error instanceof ProgressEvent) {
            // A requisição falhou completamente (ex.: servidor offline)
            console.log('Problema na comunicação com o servidor.');
        } else if (error.status === 500) {
            console.log('Erro no servidor');
        }
        // Outras lógicas de tratamento de erro
    }
    });
  }
}
