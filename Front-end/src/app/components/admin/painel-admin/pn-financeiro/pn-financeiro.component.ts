import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { ModalCadpagamentosComponent } from '../../../modal-cadpagamentos/modal-cadpagamentos.component';
import { ModalConfirmarComponent } from '../../../modal-confirmar/modal-confirmar.component';

@Component({
  selector: 'app-pn-financeiro',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,ModalCadpagamentosComponent],
  templateUrl: './pn-financeiro.component.html',
  styleUrl: './pn-financeiro.component.css'
})
export class PnFinanceiroComponent {
  @ViewChild(ModalCadpagamentosComponent) modal?: ModalCadpagamentosComponent

  total: any = '1050';
  clientes!: any;
  selectedOption!: string;
  clientesform!: FormGroup;

  constructor(private service: PnClienteService){
    this.clientes = new FormGroup({
      nmcliente: new FormControl('', [Validators.required]),
     });
  }

  openModal(){
    this.modal?.openModal()
  }
  validarmodal(confirmed: boolean){
    if (confirmed) {
     this.cadastrar();
      // Execute further actions here
    }
  }


  Clientes(){
    this.service.pesquisar().subscribe(
      (dado) => {
        // console.log('Dados recebidos:', dado);
        this.clientes = dado;
        console.log(dado);
        
      },
      (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }

  cadastrar(){
    
  }
}
