import { Component } from '@angular/core';
import { ModalSpinnerComponent } from "../../../modais/modal-spinner/modal-spinner.component";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { PnLojaService } from '../../../../services/admin/pn-loja/pn-loja.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalVendaComponent } from './modal-venda/modal-venda.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pn-loja',
  standalone: true,
  imports: [ModalSpinnerComponent, CommonModule, NgxPaginationModule, FormsModule],
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
  carrinho: any[] = [];

adicionarAoCarrinho(produto: any) {
  const qtd = produto.qtdSelecionada || 1;

  if (qtd > produto.quantidade) {
    alert('Quantidade excede o estoque!');
    return;
  }

  const existente = this.carrinho.find(p => p.id === produto.id);

  if (existente) {
    existente.qtd += qtd;
  } else {
    this.carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      qtd: qtd
    });
  }

  produto.qtdSelecionada = 1;
}

finalizarVenda() {
  console.log('Venda finalizada:', this.carrinho);
  alert('Venda finalizada com sucesso!');
  this.carrinho = [];
}

get totalCarrinho(): number {
  return this.carrinho.reduce((t, p) => t + p.preco * p.qtd, 0);
}

  abrirModal() {
    const dialogRef = this.dialog.open(ModalVendaComponent, {
      width: '400px',
      data: { produto:this.produtos }
    });

    dialogRef.afterClosed().subscribe((confirmou) => {
      if (confirmou) {
        // Atualizar estoque local
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
