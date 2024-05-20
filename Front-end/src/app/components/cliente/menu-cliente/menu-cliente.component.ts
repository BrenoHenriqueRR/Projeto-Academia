import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthserviceService } from '../../../services/authService/authservice.service';

@Component({
  selector: 'app-menu-cliente',
  standalone: true,
  imports: [RouterLink,RouterOutlet],
  templateUrl: './menu-cliente.component.html',
  styleUrl: './menu-cliente.component.css'
})
export class MenuClienteComponent {

  constructor(private router: Router, private authservice: AuthserviceService){}

  loggout(){
    this.authservice.logout();
    this.router.navigate(['/login']);
  }
}
