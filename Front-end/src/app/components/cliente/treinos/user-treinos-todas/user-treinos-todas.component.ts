import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadTreinoService } from '../../../../services/cad-treino/cad-treino.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-user-treinos-todas',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './user-treinos-todas.component.html',
    styleUrls: ['./user-treinos-todas.component.css']
})
export class UserTreinosTodasComponent {
    todasFichas: any[] = [];
    ficha: any;
    exercicios: any[] = [];
    visualizandoDetalhes: boolean = false;
    loading: boolean = false;

    constructor(private fichaservice: CadTreinoService) { }

    ngOnInit() {
        this.carregarFichas();
    }

    carregarFichas() {
        this.loading = true;
        const idCliente = localStorage.getItem('idcliente');
        this.fichaservice.pesquisarFichaId(JSON.stringify({ id: idCliente, soficha: true })).subscribe({
            next: (dados: any) => {
                this.todasFichas = dados;
                console.log(this.todasFichas)
                this.loading = false;
            },
            error: (err) => {
                console.error('Erro ao buscar todas as fichas', err);
                this.loading = false;
            }
        });
    }

    verFicha(fichaId: number) {
        this.loading = true;
        this.fichaservice.pesquisarFicha(JSON.stringify({ id: fichaId })).subscribe({
            next: (dados: any) => {
                if (dados && dados.length > 0) {
                    const primeiro = dados[0];
                    this.ficha = {
                        id: primeiro.ficha_id,
                        tipo: primeiro.tipo,
                        ordem: primeiro.ordem,
                        concluida: primeiro.concluida,
                        cliente_id: primeiro.cliente_id
                    };

                    this.exercicios = dados.map((item: any) => ({
                        exercicio: item.exercicio,
                        grupo_muscular: item.grupo_muscular,
                        series: item.series,
                        repeticoes: item.repeticoes,
                        observacoes: item.observacoes
                    }));

                    this.visualizandoDetalhes = true;
                }
                this.loading = false;
            },
            error: (err) => {
                console.error('Erro ao buscar detalhes da ficha', err);
                this.loading = false;
            }
        });
    }

    voltar() {
        this.visualizandoDetalhes = false;
        this.ficha = null;
        this.exercicios = [];
    }
}
