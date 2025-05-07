import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalSpinnerComponent } from "../../../modais/modal-spinner/modal-spinner.component";
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { PnLojaService } from '../../../../services/admin/pn-loja/pn-loja.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalVendaComponent } from './modal-venda/modal-venda.component';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalProdutoComponent } from './modal-produto/modal-produto.component';
import { ModalConfirmarComponent } from '../../../modais/modal-confirmar/modal-confirmar.component';
import { ModalEditarComponent } from './modal-editar/modal-editar.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';


@Component({
  selector: 'app-pn-loja',
  standalone: true,
  imports: [ModalSpinnerComponent, CommonModule, NgxPaginationModule, FormsModule, ModalProdutoComponent,
    ModalEditarComponent, ModalConfirmarComponent],
  providers: [provideNgxMask()],
  templateUrl: './pn-loja.component.html',
  styleUrl: './pn-loja.component.css'
})
export class PnLojaComponent {

  @ViewChild(ModalEditarComponent) modalP?: ModalEditarComponent
  @ViewChild(ModalConfirmarComponent) modal?: ModalConfirmarComponent
  loading = false;
  produtos: any[] = [];
  filtroProduto: string = '';
  paginaAtual = 1;
  carrinho: any[] = [];
  idDelete: number = 0;
  tipo: string = '';

  produtoSelecionado: any = null;

  ngOnInit() {
    this.loading = true;
    this.pesquisarProdutos();
    this.tipo = localStorage.getItem('tipoadmin') || '';
    console.log(this.tipo);
  }

  constructor(private lojaService: PnLojaService, private dialog: MatDialog, private alertas: ToastrService) { }

  openmodal(id: any) {
    this.idDelete = id;
    this.modal?.openModal();
  }

  validarmodal(confirmed: boolean) {
    if (confirmed) {
      this.removerProduto(this.idDelete);
    }
  }

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

  Closemodal() {
    this.ngOnInit();
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
    } else {
      this.alertas.error("Carrinho Vazio !!")
    }
  }


  pesquisarProdutos() {
    this.lojaService.read().subscribe({
      next: (dados) => {
        this.produtos = dados[0];
        this.produtos[0].preco = this.produtos[0].preco.replace('.', ',');
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

  editarProduto(produto: any) {
    this.modalP?.openModal(produto);
  }

  removerProduto(id: number) {
    const json = JSON.stringify({ id: id });
    this.lojaService.deleteP(json).subscribe({
      next: (dados) => {
        this.alertas.success(dados.msg);
        this.ngOnInit();
      }, error: (err) => {
        this.alertas.error(err.msg);
      }
    })
  }
}
