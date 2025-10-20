import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FaceidService } from '../../services/faceid/faceid.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entrada',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrada.component.html',
  styleUrl: './entrada.component.css',
})
export class EntradaComponent implements OnInit {
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;

  usarPin = false;
  pin: string = '';

  constructor(private faceid: FaceidService) {}

  ngOnInit() {
    this.startCamera();
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      this.video.nativeElement.srcObject = stream;
    });
  }

  captureFace() {
    const canvas = document.createElement('canvas');
    const video = this.video.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');

      Swal.fire({
        title: 'Verificando rosto...',
        text: 'Aguarde um instante.',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      this.faceid.comparar({ imagem: imageData }).subscribe({
        next: (dados) => {
          Swal.close();

          if (dados.status === 'sucesso') {
            Swal.fire({
              icon: 'success',
              title: 'Presença confirmada!',
              text: 'Reconhecimento facial bem-sucedido ✅',
              confirmButtonColor: '#007bff',
            });
            let dados = JSON.stringify({ metodo: 'faceid' });
            this.faceid.enviarPresenca(dados).subscribe();

            // Aqui você pode chamar o endpoint de presença
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Rosto não reconhecido',
              text: 'Tente novamente ou use seu PIN de acesso.',
              showCancelButton: true,
              confirmButtonText: 'Usar PIN',
              cancelButtonText: 'Tentar novamente',
              confirmButtonColor: '#007bff',
              cancelButtonColor: '#6c757d',
            }).then((result) => {
              if (result.isConfirmed) {
                this.alternarParaPin();
              }
            });
          }
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Não foi possível verificar o rosto. Tente novamente.',
            confirmButtonColor: '#dc3545',
          });
        },
      });
    }
  }

  alternarParaPin() {
    this.usarPin = true;
  }

  alternarParaFace() {
    this.usarPin = false;
  }

  enviarPin() {
    if (this.pin.length < 4) {
      Swal.fire({
        icon: 'warning',
        title: 'PIN inválido',
        text: 'Digite um PIN de 4 a 6 dígitos.',
        confirmButtonColor: '#ffc107',
      });
      return;
    }

    Swal.fire({
      title: 'Verificando PIN...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    let dados = JSON.stringify({ pin: this.pin, metodo: 'pin' });

    this.faceid.enviarPresenca(dados).subscribe({
      next: (res) => {
        Swal.close();

        if (res.status === 'sucesso') {
          Swal.fire({
            icon: 'success',
            title: 'Presença registrada!',
            text: 'PIN validado com sucesso ✅',
            confirmButtonColor: '#28a745',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'PIN incorreto',
            text: 'Verifique e tente novamente.',
            confirmButtonColor: '#dc3545',
          });
        }
      },
      error: () => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Erro no servidor',
          text: 'Não foi possível registrar presença via PIN.',
          confirmButtonColor: '#dc3545',
        });
      },
    });
  }
}
