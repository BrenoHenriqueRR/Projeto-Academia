import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, NgSelectOption, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CadTreinoService } from '../../../../services/cad-treino/cad-treino.service';
import { TreinoItem } from '../../../../interfaces/treino-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cad-treino',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './cad-treino.component.html',
  styleUrl: './cad-treino.component.css'
})
export class CadTreinoComponent {
  formFicha!: FormGroup;
  formExercicio!: FormGroup;
  cliente_id!: any;

  gruposMusculares: any[] = [];
  todosExercicios: any[] = [];
  exerciciosFiltrados: any[] = [];
  listaExercicios: any[] = [];

  mensagemSucesso!: string;

  constructor(private fb: FormBuilder, private service: CadTreinoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const clienteId = params['id'];
      if (clienteId) {
        // pré-selecionar o cliente ou preencher campo oculto
        this.cliente_id = clienteId;
      }
    });
    this.service.pgrupo().subscribe(data => {
      this.gruposMusculares = data;
    });

    this.service.pexer().subscribe(data => {
      this.todosExercicios = data;
    });

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

  filtrarExercicios(): void {
    const grupoId = this.formExercicio.value.grupoMuscular;
    this.exerciciosFiltrados = this.todosExercicios.filter(e => e.grupo_muscular_id == grupoId);
    this.formExercicio.patchValue({ exercicio: '' });
  }

  adicionarExercicio(): void {
    if (this.formExercicio.invalid) return;

    const exForm = this.formExercicio.value;
    const exercicio = this.todosExercicios.find(e => e.id == exForm.exercicio);
    const grupo = this.gruposMusculares.find(g => g.id == exForm.grupoMuscular);

    if (!exercicio || !grupo) return;

    const item = {
      exercicio_id: exercicio.id,
      exercicio_nome: exercicio.nome,
      grupo_id: grupo.id,
      grupo_nome: grupo.nome,
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
      exercicios: this.listaExercicios,
      ...this.formFicha.value,
      cliente_id: this.cliente_id
    };

    this.service.createFicha(JSON.stringify(ficha)).subscribe({
      next: (dados) => {
        alert(dados);
      },error: (er) =>{
        alert('erro');
      }
    })

    // Aqui você pode usar:
    // this.service.salvarFicha(ficha).subscribe(...)
  }
}
