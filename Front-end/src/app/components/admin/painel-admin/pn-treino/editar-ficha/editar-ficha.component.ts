import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnamneseService } from '../../../../../services/admin/anamnese/anamnese.service';
import { PnClienteService } from '../../../../../services/admin/pn-cliente/pn-cliente.service';
import { CadTreinoService } from '../../../../../services/cad-treino/cad-treino.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-ficha',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './editar-ficha.component.html',
  styleUrl: './editar-ficha.component.css'
})
export class EditarFichaComponent {
  formFicha!: FormGroup;
  formExercicio!: FormGroup;
  cliente_id: any;
  ficha_id: any; // NOVO: para guardar o ID da ficha que estamos editando
  planoCliente: any;
  fichasCliente!: any;
  gruposMusculares: any[] = [];
  todosExercicios: any[] = [];
  exerciciosFiltrados: any[] = [];
  listaExercicios: any[] = [];
  anamneseCliente: any;

  constructor(
    private fb: FormBuilder,
    private service: CadTreinoService,
    private route: ActivatedRoute,
    private alertas: ToastrService,
    private clienteservice: PnClienteService,
    private anamneseservice: AnamneseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // ALTERADO: Lógica para buscar dados da ficha para edição
    this.route.queryParams.subscribe(params => {
      const fichaId = params['id'];
      if (fichaId) {
        this.ficha_id = fichaId;
      }
    });
    console.log(this.ficha_id);

    // Inicializa os formulários primeiro
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

    // Carrega os dados auxiliares (grupos e exercícios)
    this.service.pgrupo().subscribe(data => {
      this.gruposMusculares = data;
    });

    this.service.pexer().subscribe(data => {
      this.todosExercicios = data;
    });

    // Se temos um ID de ficha, buscamos os dados para preencher o formulário
    if (this.ficha_id) {
      this.carregarDadosFicha();
    }
  }

  carregarDadosFicha(): void {
    // Você precisará de um método no serviço para buscar uma ficha completa pelo ID
    this.service.pesquisarFicha(JSON.stringify({ id: this.ficha_id })).subscribe({
      next: (dadosFicha) => {
        console.log(dadosFicha);
        if (dadosFicha && dadosFicha.length > 0) {
          const ficha = dadosFicha[0]; // Assumindo que o serviço retorna um array

          // Preenche os campos do formFicha (tipo e ordem)
          this.formFicha.patchValue({
            tipo: ficha.tipo,
            ordem: ficha.ordem
          });

          this.listaExercicios = ficha.exercicios || [];
          

          this.cliente_id = ficha.cliente_id;
          this.carregarDadosCliente();
        } else {
          this.alertas.error('Ficha não encontrada.');
          this.router.navigate(['admin/painel/treinos']);
        }
      },
      error: (err) => {
        this.alertas.error('Erro ao carregar dados da ficha.');
        console.error(err);
      }
    });
  }


  // NOVO: Separei a lógica de carregar dados do cliente para reutilização
  carregarDadosCliente(): void {
    this.clienteservice.pesquisarIdPlano(JSON.stringify({ id: this.cliente_id })).subscribe({
      next: (dados) => this.planoCliente = dados,
      error: (err) => console.log("Cliente sem plano")
    });

    this.anamneseservice.readIdCliente(JSON.stringify({ id: this.cliente_id })).subscribe({
      next: (dados) => this.anamneseCliente = dados.dados,
      error: (err) => console.log("Cliente sem anamnese")
    });

    // Para exibir as outras fichas já criadas
    this.service.pesquisarFichaId(JSON.stringify({ id: this.cliente_id, soficha: "sim" })).subscribe({
      next: (dados) => {
        this.fichasCliente = dados.length > 0 ? dados : null;
      }
    });
  }

  // As funções abaixo permanecem IGUAIS!
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
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalAnamnese'));
    modal.show();
  }
  atualizarFicha(): void {
    if (this.formFicha.invalid || this.listaExercicios.length === 0) {
      this.alertas.warning('Preencha todos os dados da ficha e adicione pelo menos um exercício.');
      return;
    }

    const fichaAtualizada = {
      ficha_id: this.ficha_id, // NOVO: Enviar o ID da ficha para o backend saber qual atualizar
      exercicios: this.listaExercicios,
      ...this.formFicha.value,
      cliente_id: this.cliente_id
    };

    // NOVO: Chamar o método de update no serviço
    this.service.updateFicha(JSON.stringify(fichaAtualizada)).subscribe({
      next: (dados) => {
        this.alertas.success(dados.msg || 'Ficha atualizada com sucesso!');
        this.router.navigate(['admin/painel/treinos']);
      },
      error: (er) => {
        this.alertas.error('Erro ao atualizar a ficha.');
        console.error(er);
      }
    });
  }
}
