import { Component, ViewChild } from '@angular/core';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginAdminService } from '../../../../services/admin/login/login-admin.service';
import { ModalCadastroComponent } from '../../../modais/modal-cadastro/modal-cadastro.component';
import { ModalConfirmarComponent } from '../../../modais/modal-confirmar/modal-confirmar.component';
import { ModalFaceidComponent } from '../../../modais/modal-faceid/modal-faceid.component';
import { ModalSpinnerComponent } from "../../../modais/modal-spinner/modal-spinner.component";
import { ModalExibirComponent } from '../../../modais/modal-exibir/modal-exibir.component';
import { MatDialog } from '@angular/material/dialog';
import { EscolhaCadastroComponent } from '../../../modais/escolha-cadastro/escolha-cadastro.component';
import { Block } from '@angular/compiler';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pn-clientes',
  standalone: true,
  imports: [NgxPaginationModule, RouterLink, NgIf, ModalConfirmarComponent,
    ModalFaceidComponent, ModalSpinnerComponent, ModalExibirComponent,
    ModalCadastroComponent, FormsModule],
  templateUrl: './pn-clientes.component.html',
  styleUrl: './pn-clientes.component.css'
})
export class PnClientesComponent {

  @ViewChild(ModalConfirmarComponent) modal?: ModalConfirmarComponent
  @ViewChild(ModalExibirComponent) modalH?: ModalExibirComponent
  public paginaAtual = 1;
  func!: string;
  dados_cli: any = '';
  loading: boolean = true;
  idDelete: any = '';
  filtrado: any[] = [];
  filtroStatus: string = 'ativo';
  filtroNome: string = '';

  ngOnInit() {
    setTimeout(() => {
      this.funcao();
      this.List();
    }, 300)
  }

  constructor(private service: PnClienteService, private router: Router,
    private loginservice: LoginAdminService, private alerts: ToastrService,
    private dialog: MatDialog) { }

  abrirModalExibir() {
    const dialogRef = this.dialog.open(EscolhaCadastroComponent, {
      width: '350px'
    });

    dialogRef.componentInstance.abrirModal.subscribe((valor) => {
      this.abrirModalCadastro();
    });
  }

  abrirModalCadastro() {
    ($('#modal-cad') as any).modal('show');
  }

  aplicarFiltros() {
    this.filtrado = this.dados_cli.filter((cliente: { status: string; nome: string }) => {
      const statusOk = this.filtroStatus ? cliente.status === this.filtroStatus : true;
      const nomeOk = this.filtroNome ? cliente.nome.toLowerCase().includes(this.filtroNome.toLowerCase()) : true;
      return statusOk && nomeOk;
    });
  }


  Closemodal() {
    this.ngOnInit();
  }

  openmodal(id: any) {
    this.idDelete = id;
    this.modal?.openModal();
  }

  openmodalH(id: any) {
    this.modalH?.openModal(id);
  }

  validarmodal(confirmed: boolean) {
    if (confirmed) {
      this.excluir(this.idDelete);
    }
  }

  List() {
    this.service.pesquisar().subscribe({
      next: (dado) => {
        // console.log(dado);
        this.dados_cli = dado;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    });
  }


  funcao() {
    const jsonString: string = '{"id": "' + localStorage.getItem('id') + '"}';
    this.loginservice.funcaoCliente(jsonString).subscribe(
      (dado) => {
        this.func = dado.funcao;
      },
      (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }

  editarcliente(cliente: any) {
    this.router.navigate(['/editar'], {
      queryParams: { id: cliente.id }
    });
  }

  excluir(id: any) {
    const jsonString: string = '{"id": "' + id + '"}';
    this.service.delete(jsonString).subscribe({
      next: (msg) => {
        this.ngOnInit();
        this.alerts.success(msg.msg)
        // location.reload();
      }
    })
  }
}
