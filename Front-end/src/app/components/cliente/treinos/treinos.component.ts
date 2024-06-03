import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UserTreinoService } from '../../../services/treino/user-treino.service';
import {  DatePipe, NgFor } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule,FormArray, ReactiveFormsModule } from '@angular/forms';
import { FichaService } from '../../../services/ficha/ficha.service';



@Component({
  selector: 'app-treinos',
  standalone: true,
  imports: [NgFor,FormsModule,ReactiveFormsModule,DatePipe],
  templateUrl: './treinos.component.html',
  styleUrl: './treinos.component.css'
})
export class TreinosComponent {
dados_cli!: any[];
feedcheck!: FormGroup;
feedback: string = '';
selectedCount: number = 0;
array:any[] = [];
contcheck:any[] = [];
i: number = 0;
checkedExercicios:any = [];
birthday = new Date();
cargaform !: FormArray;
cargasArray: { id: number, carga: any }[] = [];


@ViewChildren('checkboxes') checkboxes!: QueryList<ElementRef>;

constructor(private service:UserTreinoService, private fichaservice: FichaService){

  this.pesquisar();
}



checkboxesState = new Set<number>();

  checkCheckBoxvalue(event: any, id: number) {
    if (event.target.checked) {
      this.checkboxesState.add(id);
    } else {
      this.checkboxesState.delete(id);
    }
  }

  

cargaset(event: any, id: number) {
  const cargaInput = document.getElementById(`carga${id}`) as HTMLInputElement;
  const carga = cargaInput ? cargaInput.value : null;
  const index = this.cargasArray.findIndex(item => item.id === id);
  if (carga !== '') {
    // Verifique se o ID já existe no array
    const existe = this.cargasArray.some(item => item.id === id);
    if (!existe) {
      // Adicione o objeto ao array
      this.cargasArray.push({ id, carga });
    } else if(index !== -1) {
      console.log(`ID ${id} já existe no array.`);
      this.cargasArray[index].carga = carga;
    }
  } else {
    this.cargasArray = this.cargasArray.filter(item => item.id !== id);
  }
}


enviar(){
  this.CreateArray();
  const data = JSON.stringify(this.array);
  console.log(data);
  this.fichaservice.create(data).subscribe({
    next: (msg) => {
      location.reload();
    }
  });
}


CreateArray(): void {
  const exerciciosConcluidos = Array.from(this.checkboxesState);
  this.array = [];
  for (let index = 0; index < this.dados_cli.length; index++) {
    const exerId = this.dados_cli[index].exer_id;
    const existeNoArray = this.cargasArray.some(item => item.id === exerId);
    let cargavalue: any;
    
    if (existeNoArray) {
      const foundItem = this.cargasArray.find(item => item.id === exerId);
      if (foundItem) {
        cargavalue = foundItem.carga;
      } else {
        cargavalue = "false"; 
      }
    } else {
      cargavalue = "false";
    }
    
    const arrayy: any = {
      treino_id: exerId,
      cliente_id: this.dados_cli[index].cliente_id,
      treinos_concluido: exerciciosConcluidos.includes(exerId) ? exerId : false,
      carga: cargavalue,
      data_conclusao: this.birthday.toLocaleDateString(),
      feedback: this.feedback,
      status:'0' , // 0 concluido , 1 Em espera para fazer 
      tipo_id: this.dados_cli[index].tipo_id,
    };
    
    this.array[index] = arrayy;
  }
}  

nameTreino(): string {
  if (this.dados_cli) {
    return this.dados_cli[0].tipo;
  } else {
    return ""; 
  }
}

pesquisar(){
  const jsonString: string = '{"cliente_id": "' + localStorage.getItem('idcliente') + '"}';
  this.service.pesquisar(jsonString).subscribe({
    next:(dados) =>{
      if(dados){
      this.dados_cli = dados;
    }
    }
  });
}

}






