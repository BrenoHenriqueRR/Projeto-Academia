import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PnClienteService } from '../../../services/admin/pn-cliente/pn-cliente.service';
import { DatapickerComponent } from "../../datapicker/datapicker.component";
import moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-escolha-relatorios',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    CommonModule,
    DatapickerComponent
  ],
  templateUrl: './modal-escolha-relatorios.component.html',
  styleUrl: './modal-escolha-relatorios.component.css'
})
export class ModalEscolhaRelatoriosComponent implements OnInit {
  tipo = '';
  data_group!: FormGroup;
  selected!: { startDate: moment.Moment, endDate: moment.Moment };
  tipoRelatorio = '';
  listaClientes: any[] = [];
  dataInicio: string = '';
  dataFim: string = '';

  constructor(
    private dialogRef: MatDialogRef<ModalEscolhaRelatoriosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clienteService: PnClienteService
  ) {
    this.listaClientes = data?.clientes || [];
  }

  ngOnInit() {
    this.tipo = this.data.tipo || '';
    this.selected = {
      startDate: moment().subtract(29, 'days'),
      endDate: moment()
    };
    this.data_group = new FormGroup({
      start: new FormControl(this.selected.startDate, [Validators.required]),
      end: new FormControl(this.selected.endDate, [Validators.required]),
      Sstart: new FormControl(this.selected.startDate.format('YYYY-MM-DD')), // string formatada
      Send: new FormControl(this.selected.endDate.format('YYYY-MM-DD')),     // string formatada
    });
  }

  onDatePicked(event: { startDate: moment.Moment, endDate: moment.Moment }) {
    if (event.startDate && event.endDate) {
      this.data_group.patchValue({
        Sstart: event.startDate.format('YYYY-MM-DD'),
        Send: event.endDate.format('YYYY-MM-DD')
      });
    } else {
      this.data_group.patchValue({ Sstart: null, Send: null });
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }

  // --- Função auxiliar para validar datas e evitar repetição de código ---
private validarDatas(): boolean {
    let inicio = this.data_group.get('Sstart')?.value;
    let fim = this.data_group.get('Send')?.value;

    if ((!inicio || !fim) && this.selected?.startDate && this.selected?.endDate) {
      inicio = this.selected.startDate.format('YYYY-MM-DD');
      fim = this.selected.endDate.format('YYYY-MM-DD');
      
      this.data_group.patchValue({
        Sstart: inicio,
        Send: fim
      });
    }

    // Agora valida novamente
    if (!inicio || !fim) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção!',
        text: 'Preencha a data corretamente antes de gerar o relatório.',
        confirmButtonColor: '#007bff',
      });
      return false;
    }
    return true;
  }

  gerarRelatorioSeparado(tipoRelatorio: any) {
    // Se a validação falhar (retornar false), o return encerra a função aqui
    if (!this.validarDatas()) return;

    if (tipoRelatorio === 'presenca') {
      let dados = {
        'cliente_id': this.data.idCliente,
        'data_inicio': this.data_group.value.Sstart,
        'data_fim': this.data_group.value.Send
      }
      this.clienteService.gerarRelatorioClientesPresencaId(dados);
    }
  }

  gerarRelatorio(tipoRelatorio: any) {
    if (!this.validarDatas()) return;

    // 2. Lógica de geração
    switch (tipoRelatorio) {
      case 'status':
        this.clienteService.gerarRelatorioClientes(tipoRelatorio);
        break;
      case 'pagamentos':
        this.clienteService.gerarRelatorioClientes(tipoRelatorio);
        break;
      case 'presenca':
        this.clienteService.gerarRelatorioClientesPresenca(
          this.data_group.value.Sstart, 
          this.data_group.value.Send
        );
        break;
    }

    // 3. Só fecha o modal se a validação passou e o switch rodou
    this.dialogRef.close({ confirmado: true, tipoRelatorio: tipoRelatorio });
  }
}