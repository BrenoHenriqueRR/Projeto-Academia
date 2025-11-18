import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, NgSelectOption, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { CadTreinoService } from '../../../../services/cad-treino/cad-treino.service';
import { TreinoItem } from '../../../../interfaces/treino-item';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { AnamneseService } from '../../../../services/admin/anamnese/anamnese.service';
import { MaterialModule } from '../../../../modules/material.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cad-treino',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,RouterLink, MaterialModule],
  templateUrl: './cad-treino.component.html',
  styleUrl: './cad-treino.component.css'
})
export class CadTreinoComponent {

  formFicha!: FormGroup;
  formExercicio!: FormGroup;
  cliente_id: any;
  planoCliente: any;
  fichasCliente!: any;
  gruposMusculares: any[] = [];
  todosExercicios: any[] = [];
  exerciciosFiltrados: any[] = [];
  listaExercicios: any[] = [];
  anamneseCliente: any;

  mensagemSucesso!: string;

  constructor(private fb: FormBuilder, private service: CadTreinoService,
    private route: ActivatedRoute, private alertas: ToastrService, 
    private clienteservice: PnClienteService,private anamneseservice: AnamneseService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const clienteId = params['id'];
      if (clienteId) {
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

    this.clienteservice.pesquisarIdPlano(JSON.stringify({ id: this.cliente_id })).subscribe({
      next: (dados) => {
        this.planoCliente = dados;
        console.log(dados)
      }, error: (err) => {
        console.log("cliente sem planos")
      }
    })
    this.anamneseservice.readIdCliente(JSON.stringify({ id: this.cliente_id })).subscribe({
      next: (dados) => {
        this.anamneseCliente = dados.dados;
        console.log(this.anamneseCliente)
      }, error: (err) => {
        console.log("cliente sem planos")
      }
    })

    this.service.pesquisarFichaId(JSON.stringify({ id: this.cliente_id, soficha: "sim" })).subscribe({
      next: (dados) => {
        if (dados.length != 0) {
          this.fichasCliente = dados;
        } else {
          this.fichasCliente = null;

        }
        console.log(dados)
      }, error: (err) => {
        console.log("cliente sem ficha");
      }
    })
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

  abrirModalAnamnese() {
    const modal = new bootstrap.Modal(document.getElementById('modalAnamnese')!);
    modal.show();
  }


  criarFicha(): void {
    if (this.formFicha.invalid || this.listaExercicios.length === 0) {
      Swal.fire({
                  icon: 'error',
                  title: 'Erro!',
                  text: 'Preencha todos os dados e adicione pelo menos um exercício.',
                  confirmButtonColor: '#007bff',
      });
      return;
    }

    const ficha = {
      exercicios: this.listaExercicios,
      ...this.formFicha.value,
      cliente_id: this.cliente_id
    };

    this.service.createFicha(JSON.stringify(ficha)).subscribe({
      next: (dados) => {
        this.alertas.success(dados.msg);
        this.router.navigate(['admin/painel/treinos'])
      }, error: (er) => {
        this.alertas.error('erro ao cadastrar cliente');
      }
    })
  }
}
