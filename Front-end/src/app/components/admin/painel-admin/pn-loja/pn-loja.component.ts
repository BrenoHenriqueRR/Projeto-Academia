import { Component } from '@angular/core';
import { ModalSpinnerComponent } from "../../../modais/modal-spinner/modal-spinner.component";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { PnLojaService } from '../../../../services/admin/pn-loja/pn-loja.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalVendaComponent } from './modal-venda/modal-venda.component';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalProdutoComponent } from './modal-produto/modal-produto.component';

@Component({
  selector: 'app-pn-loja',
  standalone: true,
  imports: [ModalSpinnerComponent, CommonModule, NgxPaginationModule, FormsModule, ModalProdutoComponent],
  templateUrl: './pn-loja.component.html',
  styleUrl: './pn-loja.component.css'
})
export class PnLojaComponent {
  loading = false;
  produtos: any[] = [];
  filtroProduto: string = '';
  paginaAtual = 1;
  carrinho: any[] = [];

  produtoSelecionado: any = null;

  ngOnInit() {
    this.loading = true;
    this.pesquisarProdutos();
  }

  constructor(private lojaService: PnLojaService, private dialog: MatDialog, private alertas: ToastrService) { }

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

    produto.quantidade -= qtd;
    produto.qtdSelecionada = 1;
  }


  removerUnidade(index: number, item: any): void {
    if (this.carrinho[index].qtd > 1) {
      this.carrinho[index].qtd -= 1;
    } else {
      // Remove do carrinho se for a última unidade
      this.carrinho.splice(index, 1);
    }

    // Atualiza o estoque do produto
    this.produtos.forEach((produto) => {
      if (produto.id === item.id) {
        produto.quantidade += 1;
      }
    });
  }


  removerTudo(index: number): void {
    const itemRemovido = this.carrinho[index];

    // Devolve a quantidade ao produto original
    this.produtos.forEach((produto) => {
      if (produto.id === itemRemovido.id) {
        produto.quantidade += itemRemovido.qtd;
      }
    });

    // Remove o item do carrinho
    this.carrinho.splice(index, 1);
  }


  finalizarVenda(pagamento: string) {
    const venda = {
      produtos: this.carrinho,
      total: this.totalCarrinho,
      pagamento: pagamento,
    }

    this.lojaService.createV(JSON.stringify(venda)).subscribe({
      next: (dados) => {
        console.log(dados);
        this.alertas.success("Venda Finalizada com sucesso!");
        this.carrinho = [];
      }, error: (er) => {
        this.alertas.error(er);
      }
    })
  }

  get totalCarrinho(): number {
    return this.carrinho.reduce((t, p) => t + p.preco * p.qtd, 0);
  }

  abrirModal() {
    if (this.carrinho.length) {
      const dialogRef = this.dialog.open(ModalVendaComponent, {
        width: '400px',
        data: { produtos: this.carrinho }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.confirmado) {
          this.finalizarVenda(result.pagamento);
        }
      });
    }else{
      this.alertas.error("Carrinho Vazio !!")
    }
  }


  pesquisarProdutos() {
    this.lojaService.read().subscribe({
      next: (dados) => {
        this.produtos = dados[0];
        this.loading = false;
      }, error: (er) => {
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
