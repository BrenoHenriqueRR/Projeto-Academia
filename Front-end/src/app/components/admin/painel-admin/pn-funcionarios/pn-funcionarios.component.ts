import { Component } from '@angular/core';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PnFuncionarioService } from '../../../../services/admin/pn-funcionario/pn-funcionario.service';


@Component({
  selector: 'app-pn-funcionarios',
  standalone: true,
  imports: [NgxPaginationModule,NgFor,RouterLink],
  templateUrl: './pn-funcionarios.component.html',
  styleUrl: './pn-funcionarios.component.css'
})
export class PnFuncionariosComponent {
  public paginaAtual = 1;
  dados_funcionario: any = '';
  
  constructor(private service:PnFuncionarioService, private router:Router){
    this.List();
  }

  List(){
    this.service.pesquisar().subscribe(
      (dado) => {
        // console.log('Dados recebidos:', dado);
        this.dados_funcionario = dado;
        
      },
      (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }

  excluir(id: any){

  }
}

