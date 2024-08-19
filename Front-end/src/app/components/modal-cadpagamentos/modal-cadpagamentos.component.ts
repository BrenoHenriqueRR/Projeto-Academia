import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PnClienteService } from '../../services/admin/pn-cliente/pn-cliente.service';
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-modal-cadpagamentos',
  standalone: true,
  imports: [NgFor,NgIf,KeyValuePipe],
  templateUrl: './modal-cadpagamentos.component.html',
  styleUrl: './modal-cadpagamentos.component.css'
})
export class ModalCadpagamentosComponent {
  cliente!: any;
  valores: any = {
    "5": "R$120,00",
    "3": "R$90,00",
    "2": "R$80,00"
  };
  

  @ViewChild('modal') modal?: ElementRef
  @Output() confirm = new EventEmitter<boolean>();
  @Input() idcli: any;


  constructor(private service: PnClienteService ){
  }

  openModal(){
    ($(this.modal?.nativeElement) as any).modal('show');
  }
  
  closeModal(){
    ($(this.modal?.nativeElement) as any).modal('hide');
  }

  returntrue(){
    this.confirm.emit(true);
    this.closeModal();
  }

  returnfalse(){
    this.confirm.emit(false);
 }

 pesquisarcli(){
  const jsonString: string = '{"id": "' + this.idcli + '"}';
  this.service.pesquisarpid(jsonString).subscribe({
    next: (dados: any) =>{
      this.cliente = dados;
    },
  })
 }


}
