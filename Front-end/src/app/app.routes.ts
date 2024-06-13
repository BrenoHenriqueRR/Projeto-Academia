import { RouterModule, RouterOutlet, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { AdminComponent } from './components/admin/admin.component';
import { PainelAdminComponent } from './components/admin/painel-admin/painel-admin.component';
import { HomeClienteComponent } from './components/cliente/home-cliente/home-cliente.component';
import { MenuHomeComponent } from './components/menu-home/menu-home.component';
import { MenuClienteComponent } from './components/cliente/menu-cliente/menu-cliente.component';
import { PnFuncionariosComponent } from './components/admin/painel-admin/pn-funcionarios/pn-funcionarios.component';
import { PnClientesComponent } from './components/admin/painel-admin/pn-clientes/pn-clientes.component';
import { Component, NgModule } from '@angular/core';
import { ModalEditarComponent } from './components/admin/modal-editar/modal-editar.component';
import { DashboardComponent } from './components/admin/painel-admin/dashboard/dashboard.component';
import { TreinosComponent } from './components/cliente/treinos/treinos.component';
import { DashboardCliComponent } from './components/cliente/dashboard-cli/dashboard-cli.component';
import { PagamentosComponent } from './components/cliente/pagamentos/pagamentos/pagamentos.component';
import { PerfilComponent } from './components/cliente/perfil/perfil.component';
import { CadTreinoComponent } from './components/admin/painel-admin/cad-treino/cad-treino.component';
import { authGuard } from './guard/auth.guard';
import { PnTreinoComponent } from './components/admin/painel-admin/pn-treino/pn-treino.component';
import { PnFinanceiroComponent } from './components/admin/painel-admin/pn-financeiro/pn-financeiro.component';



export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },

    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'cadastro',
        component: CadastroComponent
    },

    {
        path: 'home-cliente',
        component: HomeClienteComponent, canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardCliComponent, canActivate: [authGuard] },
            { path: 'treinos', component: TreinosComponent, canActivate: [authGuard] },
            { path: 'pagamentos', component: PagamentosComponent, canActivate: [authGuard] },
            { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
        ]
    },


    {
        path: 'admin',
        component: AdminComponent
    },

    {
        path: 'admin/painel',
        component: PainelAdminComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'funcionarios', component: PnFuncionariosComponent },
            { path: 'clientes', component: PnClientesComponent },
            { path: 'treinos', component: PnTreinoComponent },
            { path: 'financeiro', component: PnFinanceiroComponent },
            { path: 'clientes/editar', component: ModalEditarComponent },
            { path: 'clientes/treinos', component: CadTreinoComponent },
        ],

    },

]


