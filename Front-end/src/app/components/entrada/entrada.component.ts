import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FaceidService } from '../../services/faceid/faceid.service';

@Component({
  selector: 'app-entrada',
  standalone: true,
  imports: [],
  templateUrl: './entrada.component.html',
  styleUrl: './entrada.component.css',
})

export class EntradaComponent implements OnInit  {
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;
  // @ViewChild('overlay', { static: true }) overlay!: ElementRef<HTMLCanvasElement>;

  ngOnInit() {
    this.startCamera();
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      this.video.nativeElement.srcObject = stream;
    });
  }

  constructor(private faceid: FaceidService){}


  captureFace() {
    const canvas = document.createElement('canvas');
    const video = this.video.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png'); // Captura a imagem
    
      this.compararId(imageData);

      // Aqui você pode enviar essa imagem para o backend
    }
  }

  compararId(img: String){
    const data = {
      imagem: img // Aqui está a imagem em formato Base64
    };
    let jsonData = JSON.stringify(data);
    this.faceid.comparar(jsonData).subscribe({
      next: (dados) =>{
        console.log(dados.msg);
      },error: (erro) =>{
        console.error(erro.error);
      } 
    })
    // console.log('Imagem capturada:', imagem);

  }
}

