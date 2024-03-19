import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-menu-home',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink// melhora o carregamento da imagem
  ],
  templateUrl: './menu-home.component.html',
  styleUrl: './menu-home.component.css'
})

export class MenuHomeComponent {

}
