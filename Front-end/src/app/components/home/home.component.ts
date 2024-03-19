import { Component } from '@angular/core';
import { MenuHomeComponent } from '../menu-home/menu-home.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MenuHomeComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
