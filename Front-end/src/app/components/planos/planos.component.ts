import { Component } from '@angular/core';
import { MenuHomeComponent } from '../menu-home/menu-home.component';
import { ConfigService } from '../../services/admin/config/config.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ModalSpinnerComponent } from "../modais/modal-spinner/modal-spinner.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [NgFor, ModalSpinnerComponent, NgIf, NgClass],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.css'
})
export class PlanosComponent {
  dados: any;
  planos: any;
  beneficios!: string[];
  loading: boolean = false;
  cadAdm: string = "false";

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.cadAdm = params['cad'];
    });
    this.loading = true;
    this.service.pesquisarPlanos().subscribe({
      next: (dado) => {
        this.planos = dado;
        this.planos.sort((a: { preco: number; }, b: { preco: number; }) => a.preco - b.preco);
        this.loading = false;
      }
    })
    this.service.pesquisarAcademia().subscribe({
      next: (dado) => {
        this.dados = dado;
        console.log(this.dados);
      }
    })
  }

  constructor(private service: ConfigService, private router: Router, private route: ActivatedRoute) { }

  cadastrar(plano: string, id: number) {
    if (this.cadAdm == "true") {
      this.router.navigate(['/cadastro'], {
        queryParams: { plano: plano, id: id, etapa: 1, cad : this.cadAdm }
      });
    } else {
      this.router.navigate(['/cadastro'], {
        queryParams: { plano: plano, id: id, etapa: 1 }
      });
    }
  }


}
