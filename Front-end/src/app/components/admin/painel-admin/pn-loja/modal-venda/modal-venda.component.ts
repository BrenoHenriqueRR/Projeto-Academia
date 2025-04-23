import { Component, Inject } from '@angular/core';
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
      FormsModule,CommonModule],
  templateUrl: './modal-venda.component.html',
  styleUrl: './modal-venda.component.css'
})
export class ModalVendaComponent {
  quantidade = 1;
  formaPagamento = 'dinheiro';

  ngOnInit(){
    console.log(this.data);
  }

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
    console.log(venda);


    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
