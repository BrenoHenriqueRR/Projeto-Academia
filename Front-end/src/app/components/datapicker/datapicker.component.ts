import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import moment from 'moment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datapicker',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    NgxDaterangepickerMd],
  templateUrl: './datapicker.component.html',
  styleUrl: './datapicker.component.css'
})
export class DatapickerComponent {

  @Output() dateSelected = new EventEmitter<{ startDate: moment.Moment, endDate: moment.Moment }>();

  selected!: { startDate: moment.Moment, endDate: moment.Moment };

  // A configuração de 'ranges' é a mesma
  ranges: any = {
    'Hoje': [moment(), moment()],
    'Ontem': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Últimos 7 Dias': [moment().subtract(6, 'days'), moment()],
    'Últimos 30 Dias': [moment().subtract(29, 'days'), moment()],
    'Este Mês': [moment().startOf('month'), moment().endOf('month')],
    'Mês Passado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }

   ngOnInit(): void {
    // 🔹 Define o intervalo padrão (últimos 30 dias)
    // this.selected = {
    //   startDate: moment().subtract(29, 'days'),
    //   endDate: moment()
    // };
  }

  onDateChange(value: any) {
    this.dateSelected.emit(value);
  }
}
