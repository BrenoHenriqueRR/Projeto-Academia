import { Component, ViewChild } from '@angular/core';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginAdminService } from '../../../../services/admin/login/login-admin.service';
import { ModalConfirmarComponent } from '../../../modal-confirmar/modal-confirmar.component';
@Component({
  selector: 'app-pn-clientes',
  standalone: true,
  imports: [NgxPaginationModule,NgFor,RouterLink,NgIf,ModalConfirmarComponent],
  templateUrl: './pn-clientes.component.html',
  styleUrl: './pn-clientes.component.css'
})
export class PnClientesComponent {
  @ViewChild(ModalConfirmarComponent) modal?: ModalConfirmarComponent
  public paginaAtual = 1;
  func!: string ;
  dados_cli: any = '';  
loading: boolean = true;
idDelete: any = '';
  constructor(private service:PnClienteService, private router:Router, private loginservice: LoginAdminService){
    this.List();
    this.funcao();
  }

  openmodal(id: any){
    this.idDelete = id;
    this.modal?.openModal();
  }
  validarmodal(confirmed: boolean){
    if (confirmed) {
     this.excluir(this.idDelete);
      // Execute further actions here
    }
  }
  
  List(){
    this.service.pesquisar().subscribe(
      (dado) => {
        this.dados_cli = dado;
        this.loading = false;        
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
    const jsonString: string = '{"id": "' + id + '"}';
    this.service.delete(jsonString).subscribe({
      next: (msg) => {
        location.reload();
      }
    })
  }
}
