import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PnClienteService } from '../../../services/admin/pn-cliente/pn-cliente.service';
import { DatapickerComponent } from "../../datapicker/datapicker.component";
import { data } from 'jquery';
import moment from 'moment';

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
    CommonModule, DatapickerComponent],
  templateUrl: './modal-escolha-relatorios.component.html',
  styleUrl: './modal-escolha-relatorios.component.css'
})
export class ModalEscolhaRelatoriosComponent {
  tipo = 'relatorioClientes';
   data_group !: FormGroup;
  selected!: { startDate: moment.Moment, endDate: moment.Moment };
  tipoRelatorio = '';
  listaClientes: any[] = [];
  dataInicio: string = '';
  dataFim: string = '';

  ngOnInit() {
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

  constructor(
    private dialogRef: MatDialogRef<ModalEscolhaRelatoriosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private clienteService: PnClienteService
  ) {
    this.listaClientes = data?.clientes || [];
  }

  onDatePicked(event: { startDate: moment.Moment, endDate: moment.Moment }) {
       this.data_group.patchValue({
          Sstart: event.startDate.format('YYYY-MM-DD'),
          Send: event.endDate.format('YYYY-MM-DD')
        })
    }

  cancelar() {
    this.dialogRef.close(false);
  }

  gerarRelatorioSeparado(tipoRelatorio: any) {
    if (tipoRelatorio === 'presenca') {
      let dados = {
        'cliente_id' : 124,
        'data_inicio' : this.data_group.value.Sstart,
        'data_fim' : this.data_group.value.Send
      }
      this.clienteService.gerarRelatorioClientesPresencaId(dados);
    }
    }  

  gerarRelatorio(tipoRelatorio: any) {


  //    const url = `http://localhost/sites/Projeto1/Back-end/public/Cliente/relatorioClientesStatus?data_inicio=${this.dataInicio}&data_fim=${this.dataFim}`;
  // window.open(url, '_blank');
    switch (tipoRelatorio) {
      case 'status':
        this.clienteService.gerarRelatorioClientes(tipoRelatorio);
        break;
      case 'pagamentos':
        this.clienteService.gerarRelatorioClientes(tipoRelatorio);
        break;
      case 'presenca':
         this.clienteService.gerarRelatorioClientesPresenca(this.data_group.value.Sstart, this.data_group.value.Send);
        break;
    }
    this.dialogRef.close({ confirmado: true, tipoRelatorio: tipoRelatorio });
  }
}
