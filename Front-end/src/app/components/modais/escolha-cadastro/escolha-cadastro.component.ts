import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ModalCadastroComponent } from '../modal-cadastro/modal-cadastro.component';
@Component({
  selector: 'app-escolha-cadastro',
  standalone: true,
  imports: [MatDialogModule,
    MatButtonModule],
  templateUrl: './escolha-cadastro.component.html',
  styleUrl: './escolha-cadastro.component.css'
})
export class EscolhaCadastroComponent {
   @Output() abrirModal = new EventEmitter<void>();
  constructor(
    private dialogRef: MatDialogRef<EscolhaCadastroComponent>,
    private router: Router
  ) { }

  irParaCadastroCompleto() {
    this.router.navigate(['/admin/painel/clientes/planos']);
    this.dialogRef.close();
  }

  irParaCadastroSimples() {
    this.dialogRef.close();
    this.abrirModal.emit();
  }
}
