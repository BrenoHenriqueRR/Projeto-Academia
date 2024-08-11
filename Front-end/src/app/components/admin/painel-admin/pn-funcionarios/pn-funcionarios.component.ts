import { Component, ViewChild } from '@angular/core';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PnFuncionarioService } from '../../../../services/admin/pn-funcionario/pn-funcionario.service';
import { ModalConfirmarComponent } from '../../../modal-confirmar/modal-confirmar.component';


@Component({
  selector: 'app-pn-funcionarios',
  standalone: true,
  imports: [NgxPaginationModule,NgFor,RouterLink,ModalConfirmarComponent],
  templateUrl: './pn-funcionarios.component.html',
  styleUrl: './pn-funcionarios.component.css'
})
export class PnFuncionariosComponent {
  public paginaAtual = 1;
  dados_funcionario: any = '';

  @ViewChild(ModalConfirmarComponent) modal?: ModalConfirmarComponent
  idDelete!: any;
  
  constructor(private service:PnFuncionarioService, private router:Router){
    this.List();
  }

  
  openmodal(id: any){
    this.idDelete = id;
    this.modal?.openModal();
  }
  validarmodal(confirmed: boolean){
    if (confirmed) {
     this.excluir(this.idDelete);
    }
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
    const jsonString: string = '{"id": "' + id + '"}';
    this.service.delete(jsonString).subscribe({
      next: (msg) => {
        alert(msg.msg)
        location.reload();
      }
    })
  }

}

