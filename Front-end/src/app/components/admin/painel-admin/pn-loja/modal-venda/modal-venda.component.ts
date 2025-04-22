import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-modal-venda',
  standalone: true,
  imports: [MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    BrowserAnimationsModule],
  templateUrl: './modal-venda.component.html',
  styleUrl: './modal-venda.component.css'
})
export class ModalVendaComponent {
  quantidade = 1;
  formaPagamento = 'dinheiro';

  constructor(
    public dialogRef: MatDialogRef<ModalVendaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  confirmarVenda() {
    const venda = {
      produto_id: this.data.produto.id,
      quantidade: this.quantidade,
      valor_total: this.data.produto.preco * this.quantidade,
      forma_pagamento: this.formaPagamento
    };


    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
