import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-confirmar',
  standalone: true,
  imports: [],
  templateUrl: './modal-confirmar.component.html',
  styleUrl: './modal-confirmar.component.css'
})
export class ModalConfirmarComponent {
  @ViewChild('modal') modal?: ElementRef
  @Output() confirm = new EventEmitter<boolean>();
  validator: boolean = false;

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
}
