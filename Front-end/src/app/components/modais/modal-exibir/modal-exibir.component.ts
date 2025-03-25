import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PnClienteService } from '../../../services/admin/pn-cliente/pn-cliente.service';


@Component({
  selector: 'app-modal-exibir',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './modal-exibir.component.html',
  styleUrl: './modal-exibir.component.css'
})
export class ModalExibirComponent {
  @ViewChild('modal') modal?: ElementRef
  @Output() CloseModal = new EventEmitter<void>();
  backend: string = 'http://localhost/sites/Projeto1/Back-end/public/' ;
  dados_cli: any;
  cli_id!: number;

  ngOnInit() {}

  openModal(id: any){
    this.cli_id = parseInt(id);
    ($(this.modal?.nativeElement) as any).modal('show');
    this.pesquisar();
  }

  constructor(private cli_service: PnClienteService ) { }

  pesquisar() {
    const json = '{"id": ' + this.cli_id + ' }';

    this.cli_service.pesquisarpid(json).subscribe({
      next: (dados: any) => {
          this.dados_cli = dados[0];
        console.log('Dados carregados:', this.dados_cli);
      }, error: (er) => {
        console.error('Erro ao buscar clientes:', er);
      }
    })
  }
}

