import { Component, Inject, Input, input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-venda',
  standalone: true,
  imports: [MatDialogModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatOptionModule, 
      FormsModule,
      CommonModule],
  templateUrl: './modal-venda.component.html',
  styleUrl: './modal-venda.component.css'
})
export class ModalVendaComponent {
  tipo: any = 'loja'
  carrinho_modal: any[] = [];
  formaPagamento = 'dinheiro';
  total_modal : number = 0;
  dadosPag: any;

  ngOnInit() {
    this.tipo = this.data.tipo;
    if(this.tipo == 'loja'){

      this.carrinho_modal = this.data.produtos.map((item: any) => ({ ...item }));
    
      setTimeout(() => {
        this.carrinho_modal.forEach((itens) => {
          itens.preco = parseFloat(itens.preco) * itens.qtd;
          this.total_modal += itens.preco;
        });
      }, 0);
    }else{
      this.dadosPag = this.data.pagamento;  
    }
  }

  constructor(
    public dialogRef: MatDialogRef<ModalVendaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  confirmarVenda() {
    this.dialogRef.close({
      confirmado: true,
      pagamento: this.formaPagamento
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
