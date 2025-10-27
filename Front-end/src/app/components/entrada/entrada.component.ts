import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
export class EntradaComponent implements AfterViewInit {
  @ViewChild('video', { static: false }) video!: ElementRef<HTMLVideoElement>;

  usarPin = false;
  pin: string = '';
  imagemCapturada: string | null = null;

  constructor(private faceid: FaceidService) {}

  ngAfterViewInit() {
    this.startCamera();
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => this.video.nativeElement.srcObject = stream)
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível acessar a câmera. Verifique as permissões.',
          confirmButtonColor: '#d33'
        });
      });
  }

  captureFace() {
    const video = this.video.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.imagemCapturada = canvas.toDataURL('image/png');

    const data = { imagem: this.imagemCapturada };
    this.enviarFaceId(data);
  }

  enviarFaceId(data: { imagem: string | null }) {
    if (!data.imagem) return;

    Swal.fire({
      title: 'Verificando rosto...',
      text: 'Aguarde um instante.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    this.faceid.comparar(JSON.stringify(data)).subscribe({
      next: (res) => {
        Swal.close();
        if (res.status === 'sucesso') {
          // console.log('Rosto reconhecido:', res.cliente_id);
         this.faceid.enviarPresenca(JSON.stringify({ metodo: "faceid", cliente_id: res.cliente_id })).subscribe({
          next: (response) => {
            Swal.fire({
            icon: 'success',
            title: 'Presença confirmada!',
            text: 'Reconhecimento facial bem-sucedido ✅',
            confirmButtonColor: '#007bff',
          });
            console.log('Presença registrada via Face ID:', response);
          },
          error: (err) => {
            console.error('Erro ao registrar presença via Face ID:', err);
         } });  
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
          }).then(result => { if (result.isConfirmed) this.usarPin = true; });
        }
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: err.msg || 'Ocorreu um erro ao verificar o rosto.',
          confirmButtonColor: '#dc3545',
        });
      }
    });
  }

  alternarParaPin() { this.usarPin = true; }
  alternarParaFace() { this.usarPin = false; this.startCamera(); }

  enviarPin() {
    if (this.pin.length < 4) {
      Swal.fire({ icon: 'warning', title: 'PIN inválido', text: 'Digite 4 a 6 dígitos.', confirmButtonColor: '#ffc107' });
      return;
    }

    Swal.fire({ title: 'Verificando PIN...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    this.faceid.enviarPresenca(JSON.stringify({ pin: this.pin, metodo: "pin"})).subscribe({
      next: (res) => {
        Swal.close();
        Swal.fire({
          icon: res.status === 'sucesso' ? 'success' : 'error',
          title: res.status === 'sucesso' ? 'Presença registrada!' : 'PIN incorreto',
          text: res.status === 'sucesso' ? 'PIN validado com sucesso ✅' : 'Verifique e tente novamente.',
          confirmButtonColor: res.status === 'sucesso' ? '#28a745' : '#dc3545'
        });
      },
      error: () => Swal.fire({ icon: 'error', title: 'Erro no servidor', text: 'Não foi possível registrar presença via PIN.', confirmButtonColor: '#dc3545' })
    });
  }
}
