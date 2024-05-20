import { Component } from '@angular/core';
import { UserTreinoService } from '../../../services/treino/user-treino.service';
import { TreinoItem } from '../../../interfaces/treino-item';

@Component({
  selector: 'app-treinos',
  standalone: true,
  imports: [],
  templateUrl: './treinos.component.html',
  styleUrl: './treinos.component.css'
})
export class TreinosComponent {
dados_cli!: any;

constructor(private service:UserTreinoService ){
  this.pesquisar();
}

pesquisar(){
  const jsonString: string = '{"cliente_id": "' + localStorage.getItem('idcliente') + '"}';
  this.service.pesquisar(jsonString).subscribe({
    next:(dados) =>{
      this.dados_cli = dados;
      console.log(dados);
    }
  });
}
}
