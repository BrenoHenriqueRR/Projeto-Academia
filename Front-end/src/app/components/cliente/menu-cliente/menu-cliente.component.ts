import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthserviceService } from '../../../services/authService/authservice.service';
import { PwaService } from '../../../services/pwa/pwa.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-cliente',
  standalone: true,
  imports: [RouterLink,RouterOutlet,CommonModule],
  templateUrl: './menu-cliente.component.html',
  styleUrl: './menu-cliente.component.css'
})
export class MenuClienteComponent {

  constructor(
    private router: Router,
    private authservice: AuthserviceService,
    public pwaService: PwaService
  ) { }

  loggout(){
    this.authservice.logout();
    this.router.navigate(['/login']);
  }

  installApp() {
    this.pwaService.installPwa();
  }
}
