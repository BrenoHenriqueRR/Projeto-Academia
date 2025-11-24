import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-faceid', // Esse seletor será usado no pai
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-faceid.component.html',
  styleUrls: ['./modal-faceid.component.css']
})
export class ModalFaceidComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('video', { static: false }) videoElement!: ElementRef;
  @Output() fotoConfirmada = new EventEmitter<File>();

  imagemCapturada: string | null = null;
  stream: MediaStream | null = null;

  constructor() { }

  ngAfterViewInit() {
    // Inicia imediatamente, pois o *ngIf do pai vai garantir que esse componente só exista quando a aba estiver ativa
    this.iniciarCamera();
  }

  ngOnDestroy() {
    this.pararCamera();
  }

  iniciarCamera() {
    this.imagemCapturada = null;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.dispararErro("Navegador sem suporte a câmera.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      .then(stream => {
        this.stream = stream;
        setTimeout(() => {
          if (this.videoElement && this.videoElement.nativeElement) {
            const video = this.videoElement.nativeElement;
            video.srcObject = stream;
            video.play();
          }
        }, 50); // Delay curto para garantir renderização
      })
      .catch(err => console.error("Erro câmera:", err));
  }

  pararCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  capturarSelfie() {
    if (!this.videoElement) return;
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    
    // Espelhar
    context?.translate(canvas.width, 0);
    context?.scale(-1, 1);
    
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.imagemCapturada = canvas.toDataURL('image/png' );
  }

  tentarNovamente() {
    this.imagemCapturada = null;
    // O ngIf no HTML vai remover a img e recriar o video, 
    // mas precisamos reconectar o stream no elemento de video novo
    setTimeout(() => {
        if(this.stream && this.videoElement) {
            this.videoElement.nativeElement.srcObject = this.stream;
            this.videoElement.nativeElement.play();
        }
    }, 100);
  }

  confirmarParaCadastro() {
    if (this.imagemCapturada) {
      const file = this.dataURLtoFile(this.imagemCapturada, 'Foto_FaceID_' + Math.floor(Math.random() * 1000) + '.png');
      this.fotoConfirmada.emit(file);
    }
  }

  dataURLtoFile(dataurl: string, filename: string) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)![1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){ u8arr[n] = bstr.charCodeAt(n); }
    return new File([u8arr], filename, {type:mime});
  }
  
  dispararErro(msg: string) {
      Swal.fire('Erro', msg, 'error');
  }
}