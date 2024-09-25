import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FaceidService } from '../../../services/faceid/faceid.service';

@Component({
  selector: 'app-modal-faceid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-faceid.component.html',
  styleUrl: './modal-faceid.component.css'
})
export class ModalFaceidComponent {
  @ViewChild('video', { static: true }) videoElement!: ElementRef;
  imagemCapturada: string | null = null;
  selfieSalva = false;


  ngOnInit() {
    // Acessa a câmera e exibe o vídeo no elemento <video>
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.videoElement.nativeElement.srcObject = stream;
    }).catch(err => {
      console.error("Erro ao acessar a câmera: ", err);
    });
  }

  constructor(private faceid: FaceidService) { }

  capturarSelfie() {
    // Captura uma imagem do vídeo exibido
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Converte a imagem para base64 para exibição
    this.imagemCapturada = canvas.toDataURL('image/png');
  }

  salvarSelfie() {
    // Envia a selfie para o backend para ser salva no banco de dados
    const data = {
      "imagem" : this.imagemCapturada
    };
    

    const json = JSON.stringify(data);  
    this.faceid.create(json).subscribe({
      next : (response) => {
        console.log('Selfie salva com sucesso!', response);
        this.selfieSalva = true;  // Exibe o botão de Face ID após salvar     
      },error: (err) => {
        console.error('Erro ao salvar selfie: ', err);
      },
    })


  }

  realizarFaceID() {
    // Chama o backend para verificar o Face ID com base na selfie salva
    // this.http.post('/api/verificar-faceid', {}).subscribe(
    //   response => {
    //     console.log('Verificação de Face ID realizada com sucesso!', response);
    //     alert('Face ID verificado com sucesso!');
    //   },
    //   error => {
    //     console.error('Erro ao verificar Face ID: ', error);
    //   }
    // );
  }
}
