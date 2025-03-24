import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  backend: string = 'http://localhost/sites/Projeto1/Back-end/public/' ;
  dados_cli: any;
  cli_id!: number;
  @Input() id!:  string ;
  @Output() CloseModal = new EventEmitter<void>();

  ngOnInit() {
    this.pesquisar();
  }

  constructor(private cli_service: PnClienteService ) { }
  pesquisar() {
    this.cli_id = parseInt(this.id);
    const json = '{"id": ' + this.cli_id + ' }';

    this.cli_service.pesquisarpid(json).subscribe({
      next: (dados: any) => {
        // if(dados.id == this.cli_id){
        //   this.dados_cli = dados[0];
        // }
        console.log('Dados carregados:', this.dados_cli);
      }, error: (er) => {
        console.error('Erro ao buscar clientes:', er);
      }
    })
  }
}
