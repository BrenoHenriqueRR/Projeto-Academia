import { NgFor, NgIf, KeyValuePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PnClienteService } from '../../../services/admin/pn-cliente/pn-cliente.service';
import { PnFinanceiroService } from '../../../services/admin/pn-financeiro/pn-financeiro.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-modal-comprovante',
  standalone: true,
  imports: [NgFor,NgIf,KeyValuePipe],
  templateUrl: './modal-comprovante.component.html',
  styleUrl: './modal-comprovante.component.css'
})
export class ModalComprovanteComponent {
  cliente!: any;
  @ViewChild('modal') modal?: ElementRef
  @Output() confirm = new EventEmitter<boolean>();
  @Input() idcli: any;

  constructor(private service: PnFinanceiroService ){
    
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

 gerarPdf(){
  const data = document.getElementById('comprovante');
  if (data) {
    html2canvas(data,{ scale: 2 }).then(canvas => {
      const imgWidth = 180;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 10;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('Comprovante-de-pagamento.pdf'); // Generated PDF
    });
  this.closeModal();
  }
 }

 pesquisarcli(){
  const jsonString: string = '{"cliente_id": "' + this.idcli + '"}';
  this.service.pesquisar(jsonString).subscribe({
    next: (dados: any) =>{
      this.cliente = dados;
    },
  })
}

}
