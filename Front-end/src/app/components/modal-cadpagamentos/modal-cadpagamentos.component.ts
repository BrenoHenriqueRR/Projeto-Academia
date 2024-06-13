import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-cadpagamentos',
  standalone: true,
  imports: [],
  templateUrl: './modal-cadpagamentos.component.html',
  styleUrl: './modal-cadpagamentos.component.css'
})
export class ModalCadpagamentosComponent {
  @ViewChild('modal') modal?: ElementRef
  @Output() confirm = new EventEmitter<boolean>();

  openModal(){
    $(this.modal?.nativeElement).modal('show');
  }

  closeModal(){
    $(this.modal?.nativeElement).modal('hide');
  }

  returntrue(){
    this.confirm.emit(true);
    this.closeModal();
  }

  returnfalse(){
    this.confirm.emit(false);
 }
}
