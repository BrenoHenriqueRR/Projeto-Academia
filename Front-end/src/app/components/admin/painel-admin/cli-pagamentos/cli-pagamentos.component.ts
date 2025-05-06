import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cli-pagamentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './cli-pagamentos.component.html',
  styleUrl: './cli-pagamentos.component.css'
})
export class CliPagamentosComponent {
  pagamentos: any;
  filtrado: any[] = [];
  filtroStatus: string = 'todos';

  constructor(private pagamentosService: PnClienteService) {}

  ngOnInit() {
    this.pagamentosService.listarTodosPag().subscribe(res => {
      this.pagamentos = res;
      this.aplicarFiltro();
    });
  }

  aplicarFiltro() {
    if (this.filtroStatus === 'todos') {
      this.filtrado = this.pagamentos;
    } else {
      this.filtrado = this.pagamentos.filter((p: { status: string; }) => p.status === this.filtroStatus);
    }
  }

  realizarPagamento(id: number) {
    if (confirm('Confirmar pagamento?')) {
      // this.pagamentosService.realizarPagamento(id).subscribe(() => {
      //   this.ngOnInit(); // recarrega
      // });
    }
  }

}
