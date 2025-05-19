import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CadTreinoService } from '../../../../../services/cad-treino/cad-treino.service';

@Component({
  selector: 'app-ver-fihca',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-fihca.component.html',
  styleUrl: './ver-fihca.component.css'
})
export class VerFichaComponent {
  fichasComExercicios: any[] = [];
  cliente_id: any;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const clienteId = params['id'];
      if (clienteId) {
        this.cliente_id = clienteId;
      }
    });
    this.carregarFichasDoCliente();
  }

  constructor(private route: ActivatedRoute, private service: CadTreinoService){}

  carregarFichasDoCliente() {

    this.service.pesquisarFichaId(JSON.stringify({id : this.cliente_id})).subscribe((res: any[]) => {

      console.log(res)

      const fichasMap = new Map();

      res.forEach(item => {
        const chave = `${item.ficha_id}`; // ou tipo_treino+ordem se preferir

        if (!fichasMap.has(chave)) {
          fichasMap.set(chave, {
            tipo_treino: item.tipo,
            ordem: item.ordem,
            exercicios: []
          });
        }

        fichasMap.get(chave).exercicios.push({
          nome: item.exercicio,
          grupo: item.grupo_muscular,
          series: item.series,
          repeticoes: item.repeticoes,
          obs: item.obs
        });
      });

      this.fichasComExercicios = Array.from(fichasMap.values());
    });
  }

}
