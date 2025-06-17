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
import { ModalEditarComponent } from './components/modais/modal-editar/modal-editar.component';
import { DashboardComponent } from './components/admin/painel-admin/dashboard/dashboard.component';
import { TreinosComponent } from './components/cliente/treinos/treinos.component';
import { DashboardCliComponent } from './components/cliente/dashboard-cli/dashboard-cli.component';
import { PagamentosComponent } from './components/cliente/pagamentos/pagamentos/pagamentos.component';
import { PerfilComponent } from './components/cliente/perfil/perfil.component';
import { CadTreinoComponent } from './components/admin/painel-admin/cad-treino/cad-treino.component';
import { authGuard } from './guard/cliente/auth.guard';
import { PnTreinoComponent } from './components/admin/painel-admin/pn-treino/pn-treino.component';
import { PnFinanceiroComponent } from './components/admin/painel-admin/pn-financeiro/pn-financeiro.component';
import { RecuperarSenhaComponent } from './components/recuperar-senha/recuperar-senha.component';
import { PnRelatoriosComponent } from './components/admin/painel-admin/pn-relatorios/pn-relatorios.component';
import { ModalEditarFuncionarioComponent } from './components/modais/modal-editar-funcionario/modal-editar.component';
import { ConfighomeComponent } from './components/admin/configuracao/confighome/confighome.component';
import { adminGuard } from './guard/admin/admin.guard';
import { PlanosComponent } from './components/planos/planos.component';
import { PnPlanosComponent } from './components/admin/painel-admin/pn-planos/pn-planos.component';
import { ModalEditarPlanosComponent } from './components/modais/modal-editar-planos/modal-editar-planos.component';
import { EntradaComponent } from './components/entrada/entrada.component';
import { PnLojaComponent } from './components/admin/painel-admin/pn-loja/pn-loja.component';
import { AnamneseComponent } from './components/admin/painel-admin/anamnese/anamnese.component';
import { CadAnamneseComponent } from './components/admin/painel-admin/anamnese/cad-anamnese/cad-anamnese.component';
import { EditarAnamneseComponent } from './components/admin/painel-admin/anamnese/editar-anamnese/editar-anamnese.component';
import { CliPagamentosComponent } from './components/admin/painel-admin/cli-pagamentos/cli-pagamentos.component';
import { VerFichaComponent } from './components/admin/painel-admin/pn-treino/ver-fihca/ver-ficha.component';
import { ListarComponent } from './components/admin/painel-admin/despesas/listar/listar.component';
import { FormularioComponent } from './components/admin/painel-admin/despesas/formulario/formulario.component';
import { ManualComponent } from './components/admin/painel-admin/manual/manual.component';
import { EditarFichaComponent } from './components/admin/painel-admin/pn-treino/editar-ficha/editar-ficha.component';


export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },

    {
        path: 'login',
        component: LoginComponent
    },
    // {
    //     path: 'planos',
    //     component: PlanosComponent,
    //     canActivate: [adminGuard]
    // },
    {
        path: 'entrada',
        component: EntradaComponent
    },

    // {
    //     path: 'cadastro',
    //     component: CadastroComponent
    // },
    {
        path: 'recuperar-senha',
        component: RecuperarSenhaComponent
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
        path: 'admin/configuracoes',
        component: ConfighomeComponent,
    },
    {
        path: 'admin/painel',
        component: PainelAdminComponent,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
            { path: 'funcionarios', component: PnFuncionariosComponent, canActivate: [adminGuard] },
            { path: 'funcionarios/editarf', component: ModalEditarFuncionarioComponent, canActivate: [adminGuard] },
            { path: 'treinos', component: PnTreinoComponent, canActivate: [adminGuard] },
            { path: 'treinos/cad-ficha', component: CadTreinoComponent, canActivate: [adminGuard] },
            { path: 'treinos/ver-fichas', component: VerFichaComponent, canActivate: [adminGuard] },
            { path: 'treinos/editar-fichas', component: EditarFichaComponent, canActivate: [adminGuard] },
            { path: 'pn-planos', component: PnPlanosComponent, canActivate: [adminGuard] },
            { path: 'pn-planos/editar', component: ModalEditarPlanosComponent, canActivate: [adminGuard] },
            { path: 'financeiro', component: PnFinanceiroComponent, canActivate: [adminGuard] },
            { path: 'manual', component: ManualComponent, canActivate: [adminGuard] },
            { path: 'relatorios', component: PnRelatoriosComponent, canActivate: [adminGuard] },
            { path: 'loja', component: PnLojaComponent, canActivate: [adminGuard] },
            { path: 'despesas', component: ListarComponent, canActivate: [adminGuard] },
            { path: 'despesas/novo', component: FormularioComponent, canActivate: [adminGuard] },
            { path: 'clientes/editar', component: ModalEditarComponent, canActivate: [adminGuard] },
            { path: 'clientes', component: PnClientesComponent, canActivate: [adminGuard] },
            { path: 'clientes/anamnese', component: AnamneseComponent, canActivate: [adminGuard] },
            { path: 'clientes/pagamentos', component: CliPagamentosComponent, canActivate: [adminGuard] },
            { path: 'clientes/anamnese/cadastrar', component: CadAnamneseComponent, canActivate: [adminGuard] },
            { path: 'clientes/anamnese/editar', component: EditarAnamneseComponent, canActivate: [adminGuard] },
            { path: 'clientes/treinos', component: CadTreinoComponent, canActivate: [adminGuard] },
            { path: 'clientes/planos', component: PlanosComponent, canActivate: [adminGuard] },
            { path: 'clientes/planos/cadastro', component: CadastroComponent, canActivate: [adminGuard]},
        ],

    },

]


