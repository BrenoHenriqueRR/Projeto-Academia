import { Component, inject } from '@angular/core';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { PnFinanceiroService } from '../../../../services/admin/pn-financeiro/pn-financeiro.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: []
})
export class DashboardComponent {
  total: any;
  cliPendente: any;

  constructor(private service: PnClienteService,private cadservice: PnFinanceiroService){}
}
