import { Component } from '@angular/core';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginAdminService } from '../../../../services/admin/login/login-admin.service';

@Component({
  selector: 'app-pn-clientes',
  standalone: true,
  imports: [NgxPaginationModule,NgFor,RouterLink,NgIf],
  templateUrl: './pn-clientes.component.html',
  styleUrl: './pn-clientes.component.css'
})
export class PnClientesComponent {
  public paginaAtual = 1;
  func!: string ;
  dados_cli: any = '';
  constructor(private service:PnClienteService, private router:Router, private loginservice: LoginAdminService){
    this.List();
    this.funcao();
  }

  List(){
    this.service.pesquisar().subscribe(
      (dado) => {
        // console.log('Dados recebidos:', dado);
        this.dados_cli = dado;
        
      },
      (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }

  funcao(){
    const jsonString: string = '{"id": "' + localStorage.getItem('id') + '"}';
    this.loginservice.funcaoCliente(jsonString).subscribe(
      (dado) => {
          this.func = dado[0].funcao;
      },
      (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }

  editarcliente(cliente: any){
    this.router.navigate(['/editar'], {
      queryParams: { id: cliente.id}
    });
  }

  excluir(id: any){

  }
}
