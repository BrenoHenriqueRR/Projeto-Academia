import { Component, Inject } from '@angular/core';
import { LoginAdminService } from '../../../services/admin/login/login-admin.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PnFuncionariosComponent } from './pn-funcionarios/pn-funcionarios.component';
import {MatTabsModule} from '@angular/material/tabs';



@Component({
  selector: 'app-painel-admin',
  standalone: true,
  imports: [RouterOutlet, PnFuncionariosComponent,RouterLink,MatTabsModule,RouterLinkActive],
  providers:[
    LoginAdminService,
  ],
  templateUrl: './painel-admin.component.html',
  styleUrl: './painel-admin.component.css'
})
export class PainelAdminComponent  {
[x: string]: any;
  private dados: any;
  funcionalidade!: any;

  constructor(private service: LoginAdminService, @Inject(ActivatedRoute) private route: ActivatedRoute){
    this.route.queryParams.subscribe(params => {
       if(params['user'] !== undefined){
        this.dados = params['user'] ;
        localStorage.setItem('email', this.dados); 

       };
    });
    this.funcao();
  }
  AbrirSidebar() {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
          sidebar.classList.toggle('open-sidebar');
      }
  }
  funcao(){
    const jsonString: string = '{"email": "' + localStorage.getItem('email') + '"}';
    this.service.funcao(jsonString).subscribe(
      (dado) => {
        this.funcionalidade = dado[0].funcao;
        localStorage.setItem('id', dado[0].id);

      },
      (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }
}

