import { Component, Inject } from '@angular/core';
import { LoginAdminService } from '../../../services/admin/login/login-admin.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PnFuncionariosComponent } from './pn-funcionarios/pn-funcionarios.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';



@Component({
  selector: 'app-painel-admin',
  standalone: true,
  imports: [RouterOutlet, PnFuncionariosComponent, RouterLink, MatTabsModule, RouterLinkActive, FormsModule,CommonModule ],
  providers: [
    LoginAdminService,
  ],
  templateUrl: './painel-admin.component.html',
  styleUrl: './painel-admin.component.css'
})
export class PainelAdminComponent {
  [x: string]: any;
  private dados: any;
  funcionalidade!: any;
  termoBusca: string = '';
  menuItems: any[] = [
    { description: 'Dashboard', routerLink: 'dashboard', iconClass: 'fa-solid fa-chart-line' },
    { description: 'Treinos', routerLink: 'treinos', iconClass: 'fa-solid fa-dumbbell' },
    { description: 'Clientes', routerLink: 'clientes', iconClass: 'fa-solid fa-user' },
    { description: 'Funcionários', routerLink: 'funcionarios', iconClass: 'fa-solid fa-user-tie' },
    { description: 'Financeiro', routerLink: 'financeiro', iconClass: 'fa-solid fa-coins' },
  ];

  constructor(private service: LoginAdminService, @Inject(ActivatedRoute) private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['user'] !== undefined) {
        this.dados = params['user'];
        localStorage.setItem('email', this.dados);

      };
    });
    this.funcao();
  }

  correspondeBusca(item: any): boolean {
    return item.description.toLowerCase().includes(this.termoBusca.toLowerCase());
  }

  resetarBusca(): void {
    this.termoBusca = '';
  }

  AbrirSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open-sidebar');
    }
  }
  funcao() {
    const jsonString: string = '{"email": "' + localStorage.getItem('email') + '"}';
    this.service.funcao(jsonString).subscribe({
      next: (dado) => {
        this.funcionalidade = dado[0].funcao;
        localStorage.setItem('id', dado[0].id);
      },
      error: (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }}
    );
  }
}

