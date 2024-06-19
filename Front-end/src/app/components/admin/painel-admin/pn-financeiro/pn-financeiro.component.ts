import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { ModalCadpagamentosComponent } from '../../../modal-cadpagamentos/modal-cadpagamentos.component';
import { ModalConfirmarComponent } from '../../../modal-confirmar/modal-confirmar.component';
import { PnFinanceiroService } from '../../../../services/admin/pn-financeiro/pn-financeiro.service';

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
  cadpag!: any;

  constructor(private service: PnClienteService,private cadservice: PnFinanceiroService){
  }

  openModal(){
    this.modal?.openModal();
  }
  validarmodal(confirmed: boolean){
    if (confirmed) {
     this.pesquisarcli();
    }
  }


  Clientes(){
    this.service.pesquisar().subscribe(
      (dado) => {
        // console.log('Dados recebidos:', dado);
        this.clientes = dado;
        
      },
      (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }

  pesquisarcli(){
    const jsonString: string = '{"id": "' + this.selectedOption + '"}';
    this.service.pesquisarpid(jsonString).subscribe({
      next: (dados: any) =>{
        this.cadpag = dados;
        this.cadastrar(this.cadpag);
      },
    })
   }
  

  cadastrar(json: any){
    const cadjson = JSON.stringify(json[0]);
    console.log(cadjson);
    this.cadservice.cadastrar(cadjson).subscribe({
      next(dados) {
        alert(dados.msg);
      }
    })
  }
}
