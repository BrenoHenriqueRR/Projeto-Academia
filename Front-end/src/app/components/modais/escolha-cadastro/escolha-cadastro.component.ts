import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-escolha-cadastro',
  standalone: true,
  imports: [MatDialogModule,
    MatButtonModule,],
  templateUrl: './escolha-cadastro.component.html',
  styleUrl: './escolha-cadastro.component.css'
})
export class EscolhaCadastroComponent {
  constructor(
    private dialogRef: MatDialogRef<EscolhaCadastroComponent>,
    private router: Router
  ) { }

  irParaCadastroCompleto() {
    this.router.navigate(['/planos']);
    this.dialogRef.close();
  }

  irParaCadastroSimples() {
    // this.router.navigate(['/cadastro-simples']);
    const modalElement = document.getElementById('exampleModal');
    // const bootstrapModal = new bootstrap.Modal(modalElement!);
    // bootstrapModal.show();
    this.dialogRef.close();
  }
}
