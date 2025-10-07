import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PnClienteService } from '../../../services/admin/pn-cliente/pn-cliente.service';

@Component({
  selector: 'app-modal-escolha-relatorios',
  standalone: true,
  imports: [MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    CommonModule],
  templateUrl: './modal-escolha-relatorios.component.html',
  styleUrl: './modal-escolha-relatorios.component.css'
})
export class ModalEscolhaRelatoriosComponent {
  tipo = 'relatorioClientes';
  tipoRelatorio = '';
  listaClientes: any[] = [];
  dataInicio: string = '';
  dataFim: string = '';

  constructor(
    private dialogRef: MatDialogRef<ModalEscolhaRelatoriosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private clienteService: PnClienteService
  ) {
    this.listaClientes = data?.clientes || [];
  }

  cancelar() {
    this.dialogRef.close(false);
  }

  gerarRelatorio(tipoRelatorio: any) {
    // if (!this.dataInicio || !this.dataFim) {
    //   alert('Selecione o intervalo de datas!');
    //   return;
    // }

  //    const url = `http://localhost/sites/Projeto1/Back-end/public/Cliente/relatorioClientesStatus?data_inicio=${this.dataInicio}&data_fim=${this.dataFim}`;
  // window.open(url, '_blank');
    switch (tipoRelatorio) {
      case 'status':
        this.clienteService.gerarRelatorioClientes(tipoRelatorio);
        break;
      case 'pagamentos':
        this.clienteService.gerarRelatorioClientes(tipoRelatorio);
        break;
    }
    this.dialogRef.close({ confirmado: true, tipoRelatorio: tipoRelatorio });
  }
}
