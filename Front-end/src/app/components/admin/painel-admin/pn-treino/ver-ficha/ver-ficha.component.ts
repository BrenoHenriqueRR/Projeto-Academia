import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CadTreinoService } from '../../../../../services/cad-treino/cad-treino.service';
import { finalize } from 'rxjs';
import { ModalSpinnerComponent } from '../../../../modais/modal-spinner/modal-spinner.component';
import { MaterialModule } from '../../../../../modules/material.module';

@Component({
  selector: 'app-ver-fihca',
  standalone: true,
  imports: [CommonModule, ModalSpinnerComponent, RouterLink, MaterialModule],
  templateUrl: './ver-ficha.component.html',
  styleUrl: './ver-ficha.component.css'
})
export class VerFichaComponent {
  fichasComExercicios: any[] = [];
  cliente_id: any;
  isLoading = false;

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
             ficha_id : item.ficha_id,
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

  gerarPdf(){
    if (this.isLoading) return;
    this.isLoading = true; 
    this.service.getFichaPdf(this.cliente_id).pipe(
        // 5. O finalize garante que o loading será desativado ao final
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (blob) => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = `Ficha-de-treino-cliente-${this.cliente_id}.pdf`; 
          a.click();
          URL.revokeObjectURL(objectUrl);
        },
        error: (err) => {
          console.error('Erro ao baixar o PDF:', err);
          alert('Não foi possível baixar o PDF. Tente novamente.');
        }
      });
  }

}
