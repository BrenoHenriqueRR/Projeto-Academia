import { Component, Inject } from '@angular/core';
import { LoginAdminService } from '../../../services/admin/login/login-admin.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PnFuncionariosComponent } from './pn-funcionarios/pn-funcionarios.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { AuthserviceService } from '../../../services/authService/authservice.service';
import { environment } from '../../../../environments/environment';
import { ConfigService } from '../../../services/admin/config/config.service';



@Component({
  selector: 'app-painel-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatTabsModule, RouterLinkActive, FormsModule, CommonModule],
  providers: [
    LoginAdminService,
  ],
  templateUrl: './painel-admin.component.html',
  styleUrl: './painel-admin.component.css'
})
export class PainelAdminComponent {
  [x: string]: any;
  abrirDrop: boolean = true
  private dados: any;
  funcionalidade!: any;
  termoBusca: string = '';
  fotoPerfil: string = '';
  menuItems: any[] = [
    { description: 'Dashboard', routerLink: 'dashboard', iconClass: 'fa-solid fa-chart-line' },
    { description: 'Treinos', routerLink: 'treinos', iconClass: 'fa-solid fa-dumbbell' },
    { description: 'Clientes', routerLink: 'clientes', iconClass: 'fa-solid fa-user' },
    { description: 'Anamnese', routerLink: 'clientes/anamnese', iconClass: 'fas fa-notes-medical' },
    { description: 'Pagamentos', routerLink: 'clientes/pagamentos', iconClass: 'fa-solid fa-sack-dollar' },
    { description: 'Funcionários', routerLink: 'funcionarios', iconClass: 'fa-solid fa-user-tie' },
    { description: 'Financeiro', routerLink: 'financeiro', iconClass: 'fa-solid fa-coins' },
  ];

  ngOnInit(){
    let etapa;
    this.configservice.pesquisar().subscribe({
      next: (value) => {
        etapa = parseInt(value[0].etapa_atual);
        console.log(etapa);
    if (etapa < 4) {
      this.router.navigate(['/admin/configuracoes']);
      }
     }, error: (err) => {
        console.log(err);
      },
    })
  }

  

  constructor(private router: Router,private configservice: ConfigService ,private service: LoginAdminService, @Inject(ActivatedRoute) private route: ActivatedRoute,private guard: AuthserviceService) {
    this.route.queryParams.subscribe(params => {
      if (params['user'] !== undefined) {
        this.dados = params['user'];
        localStorage.setItem('email', this.dados);

      };
    });
    this.funcao();
  }

  openDrop(){
    this.abrirDrop = !this.abrirDrop;

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
        this.fotoPerfil = environment.apiUrl + '/' + dado[0].foto;
      },
      error: (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }}
    );
  }

  logout(){
    this.guard.logoutadm();
  }

}

