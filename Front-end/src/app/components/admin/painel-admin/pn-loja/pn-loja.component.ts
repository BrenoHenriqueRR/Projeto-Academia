import { Component } from '@angular/core';
import { ModalSpinnerComponent } from "../../../modais/modal-spinner/modal-spinner.component";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { PnLojaService } from '../../../../services/admin/pn-loja/pn-loja.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalVendaComponent } from './modal-venda/modal-venda.component';

@Component({
  selector: 'app-pn-loja',
  standalone: true,
  imports: [ModalSpinnerComponent, CommonModule, NgxPaginationModule],
  templateUrl: './pn-loja.component.html',
  styleUrl: './pn-loja.component.css'
})
export class PnLojaComponent {
  loading = false;
  produtos: any[] = [];
  filtroProduto: string = '';
  paginaAtual = 1;

  produtoSelecionado: any = null;

  ngOnInit(){
    this.loading = true;
    this.pesquisarProdutos();
  }

  abrirModal(produto: any) {
    const dialogRef = this.dialog.open(ModalVendaComponent, {
      width: '400px',
      data: { produto }
    });

    dialogRef.afterClosed().subscribe((confirmou) => {
      if (confirmou) {
        // Atualizar estoque local
        produto.quantidade -= 1;
      }
    });
  }

  constructor(private lojaService: PnLojaService, private dialog: MatDialog) {}

  pesquisarProdutos(){
    this.lojaService.read().subscribe({
      next: (dados) =>{
        this.produtos = dados[0];
        this.loading = false;
        console.log(this.produtos);
      }, error: (er) =>{
        this.loading = false;
        console.log(er);
      }
    })
  }

  abrirModalProduto() {
    this.produtoSelecionado = null;
    // abrir modal de novo produto (exemplo com @ViewChild ou serviço)
  }

  fecharModalProduto() {
    // fechar modal e recarregar lista, se necessário
  }

  editarProduto(produto: any) {
    this.produtoSelecionado = produto;
    // abrir modal de edição
  }

  removerProduto(id: number) {
    if (confirm('Tem certeza que deseja remover este produto?')) {
      // lógica para remover produto
    }
  }
}
