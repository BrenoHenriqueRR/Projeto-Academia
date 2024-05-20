import { Component } from '@angular/core';
import { MenuClienteComponent } from '../menu-cliente/menu-cliente.component';

@Component({
  selector: 'app-home-cliente',
  standalone: true,
  imports: [MenuClienteComponent],
  templateUrl: './home-cliente.component.html',
  styleUrl: './home-cliente.component.css'
})
export class HomeClienteComponent {
  // validar(){
  //   if(){
  //     location.href = "/login";
  //   }
  // }
}
