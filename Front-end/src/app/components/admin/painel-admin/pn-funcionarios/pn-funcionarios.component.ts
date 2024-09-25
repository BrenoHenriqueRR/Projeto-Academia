import { Component, ViewChild } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PnFuncionarioService } from '../../../../services/admin/pn-funcionario/pn-funcionario.service';
import { ModalConfirmarComponent } from '../../../modais/modal-confirmar/modal-confirmar.component';
import { ModalCadastroComponent } from "../../../modais/modal-cadastro/modal-cadastro.component";
import { ModalSpinnerComponent } from "../../../modais/modal-spinner/modal-spinner.component";


@Component({
  selector: 'app-pn-funcionarios',
  standalone: true,
  imports: [NgxPaginationModule, NgFor, RouterLink, ModalConfirmarComponent, ModalCadastroComponent, ModalSpinnerComponent,NgIf],
  templateUrl: './pn-funcionarios.component.html',
  styleUrl: './pn-funcionarios.component.css'
})
export class PnFuncionariosComponent {
  public paginaAtual = 1;
  dados_funcionario: any = '';
  loading: boolean = false;

  @ViewChild(ModalConfirmarComponent) modal?: ModalConfirmarComponent
  idDelete!: any;

  ngOnInit() {
    this.loading = true;
    this.service.pesquisar().subscribe({
      next: (dado) => {
        this.dados_funcionario = dado;
        setTimeout(() =>{
          this.loading = false;
        },200);

      },
      error: (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    });
  }

  constructor(private service: PnFuncionarioService, private router: Router) {
    this.List();
  }


  openmodal(id: any) {
    this.idDelete = id;
    this.modal?.openModal();
  }
  validarmodal(confirmed: boolean) {
    if (confirmed) {
      this.excluir(this.idDelete);
    }
  }

  Closemodal() {
    this.ngOnInit();
  }

  List() {
    this.service.pesquisar().subscribe({
      next: (dado) => {
        // console.log('Dados recebidos:', dado);
        this.dados_funcionario = dado;

      },
      error: (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    });
  }

  excluir(id: any) {
    const jsonString: string = '{"id": "' + id + '"}';
    this.service.delete(jsonString).subscribe({
      next: (msg) => {
        alert(msg.msg)
        location.reload();
      }
    })
  }

}

