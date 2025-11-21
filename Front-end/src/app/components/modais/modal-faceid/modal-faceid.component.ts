import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-faceid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-faceid.component.html',
  styleUrls: ['./modal-faceid.component.css']
})
export class ModalFaceidComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('video', { static: false }) videoElement!: ElementRef;
  
  // Envia o arquivo para o pai
  @Output() fotoConfirmada = new EventEmitter<File>();

  imagemCapturada: string | null = null;
  stream: MediaStream | null = null;

  constructor() { }

  ngAfterViewInit() {
    // this.iniciarCamera();
  }

  ngOnDestroy() {
    this.pararCamera();
  }

  iniciarCamera() {
    this.imagemCapturada = null;

    // Verifica se o navegador tem suporte a API de mídia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.dispararErro("Seu navegador não suporta acesso à câmera.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.stream = stream;
        setTimeout(() => {
          if (this.videoElement && this.videoElement.nativeElement) {
            this.videoElement.nativeElement.srcObject = stream;
          }
        }, 100);
      })
      .catch(err => {
        console.error("Erro ao acessar a câmera: ", err);
        
        let msg = "Ocorreu um erro ao tentar abrir a câmera.";
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          msg = "Permissão negada! Por favor, permita o acesso à câmera nas configurações do navegador.";
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          msg = "Nenhuma câmera foi encontrada neste dispositivo.";
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          msg = "A câmera já está sendo usada por outro aplicativo.";
        }

        this.dispararErro(msg);
      });
  }

  // Função auxiliar para chamar o Swal e fechar o modal se necessário
  dispararErro(mensagem: string) {
    Swal.fire({
      icon: 'error',
      title: 'Erro na Câmera',
      text: mensagem,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Fechar'
    }).then(() => {
      // Opcional: Fecha o modal automaticamente se der erro, para o usuário não ficar na tela preta
      // Você pode precisar importar o ElementRef para pegar o botão de fechar ou usar JQuery/Bootstrap JS
      const btnClose = document.querySelector('#modalfaceid .btn-close') as HTMLElement;
      if(btnClose) btnClose.click();
    });
  }

  pararCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  capturarSelfie() {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    
    // Configura tamanho do canvas igual ao do video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    // Espelha a imagem horizontalmente se quiser (opcional)
    // context?.translate(canvas.width, 0);
    // context?.scale(-1, 1);
    
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.imagemCapturada = canvas.toDataURL('image/jpeg', 0.9); // Qualidade 0.9
  }

  // Chamado pelo botão "Repetir"
  tentarNovamente() {
    this.imagemCapturada = null;
    // Às vezes precisa reinicializar o stream se tiver parado, 
    // mas aqui só limpamos a imagem para o ngIf mostrar o vídeo de novo.
  }

  // Chamado pelo botão "Usar Foto"
  confirmarParaCadastro() {
    if (this.imagemCapturada) {
      const file = this.dataURLtoFile(this.imagemCapturada, 'faceid.jpg');
      this.fotoConfirmada.emit(file); // Envia para o pai
    }
  }

  // Função utilitária
  dataURLtoFile(dataurl: string, filename: string) {
    let arr = dataurl.split(','),
        match = arr[0].match(/:(.*?);/),
        mime = match ? match[1] : 'image/jpeg',
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }
}