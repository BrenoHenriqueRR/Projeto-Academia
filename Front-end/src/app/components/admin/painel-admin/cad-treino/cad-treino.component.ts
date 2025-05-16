import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, NgSelectOption, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CadTreinoService } from '../../../../services/cad-treino/cad-treino.service';
import { TreinoItem } from '../../../../interfaces/treino-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cad-treino',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './cad-treino.component.html',
  styleUrl: './cad-treino.component.css'
})
export class CadTreinoComponent {
  ttreino!: any;
  gtreino!: any;
  etreino!: any;
  tipo: any;
  grupo: any;
  exer: any[] = [];
  teste: any;

  isDisabled: boolean = false;
  inputData!: any;
  treinos: TreinoItem[] = [];
  formcadastro!: FormGroup;
  cliente!: string;
  click: boolean = false;
  mensagemSucesso!: string;

  formFicha!: FormGroup;
  formExercicio!: FormGroup;

  gruposMusculares!: any[];
  exercicios!: any[];

  exerciciosFiltrados: any[] = [];
  listaExercicios: any[] = [];

  
  ngOnInit(): void {
    this.formFicha = this.fb.group({
      tipo: ['', Validators.required],
      ordem: ['', Validators.required]
    });
    
    this.formExercicio = this.fb.group({
      grupoMuscular: ['', Validators.required],
      exercicio: ['', Validators.required],
      series: ['', Validators.required],
      repeticoes: ['', Validators.required],
      observacoes: ['']
    });
  }

  constructor(private fb: FormBuilder, private service: CadTreinoService) {}
  
  filtrarExercicios(): void {
    const grupoId = this.formExercicio.value.grupoMuscular;
    this.exerciciosFiltrados = this.exercicios.filter(e => e.grupoMuscular == grupoId);
    this.formExercicio.patchValue({ exercicio: '' });
  }

  adicionarExercicio(): void {
    const exForm = this.formExercicio.value;
    const exercicio = this.exercicios.find(e => e.id == exForm.exercicio);
    const grupo = this.gruposMusculares.find(g => g.id == exForm.grupoMuscular);

    const item = {
      exercicio_id: exercicio!.id,
      exercicio_nome: exercicio!.nome,
      grupo_id: grupo!.id,
      grupo_nome: grupo!.nome,
      series: exForm.series,
      repeticoes: exForm.repeticoes,
      observacoes: exForm.observacoes
    };

    this.listaExercicios.push(item);
    this.formExercicio.reset();
  }

  removerExercicio(index: number): void {
    this.listaExercicios.splice(index, 1);
  }

  criarFicha(): void {
    if (this.formFicha.invalid || this.listaExercicios.length === 0) {
      alert('Preencha todos os dados e adicione pelo menos um exercício.');
      return;
    }

    const ficha = {
      ...this.formFicha.value,
      exercicios: this.listaExercicios
    };

    console.log('Ficha final a ser enviada:', ficha);
    // aqui você faz o POST para o backend (CodeIgniter 4)
  }
  
}
