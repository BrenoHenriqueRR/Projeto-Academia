import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnamneseService } from '../../../../../services/admin/anamnese/anamnese.service';
import { PnClienteService } from '../../../../../services/admin/pn-cliente/pn-cliente.service';
import { CadTreinoService } from '../../../../../services/cad-treino/cad-treino.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../modules/material.module';
import Swal from 'sweetalert2';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-editar-ficha',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    CommonModule,
    MaterialModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './editar-ficha.component.html',
  styleUrl: './editar-ficha.component.css'
})
export class EditarFichaComponent implements OnInit {

  formFicha!: FormGroup;
  formExercicio!: FormGroup;

  // IDs
  cliente_id: any;
  ficha_id: any; // Se existir, é edição. Se não, é criação (mas precisa de cliente_id).

  // Dados Auxiliares
  planoCliente: any;
  fichasCliente!: any;
  gruposMusculares: any[] = [];
  todosExercicios: any[] = [];

  // Autocomplete
  exerciciosFiltrados!: Observable<any[]>;

  // Lista Local da Ficha
  listaExercicios: any[] = [];

  // Outros
  anamneseCliente: any;
  exercicioDigitado = '';
  novoExercicio = {
    nome: '',
    grupo_muscular_id: ''
  };

  isEditMode = false;

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
    // 1. Inicializar Forms
    this.formFicha = this.fb.group({
      tipo: ['', Validators.required],
      ordem: ['', Validators.required]
    });

    this.formExercicio = this.fb.group({
      grupoMuscular: [''], // Opcional, serve mais para filtro visual se quisesse
      exercicioObj: ['', Validators.required], // Vai guardar o objeto inteiro do exercício selecionado
      series: ['', Validators.required],
      repeticoes: ['', Validators.required],
      observacoes: ['']
    });

    // 2. Carregar QueryParams
    this.route.queryParams.subscribe(params => {
      this.ficha_id = params['id'];   // Para Edição
      this.cliente_id = params['cliente_id']; // Para Criação (novo)

      // Se tem ficha_id, estamos EDITANDO
      if (this.ficha_id) {
        this.isEditMode = true;
        this.carregarDadosFicha();
      }
      // Se não tem ficha_id, mas tem cliente_id, estamos CRIANDO
      else if (this.cliente_id) {
        this.isEditMode = false;
        this.carregarDadosCliente(); // Apenas carrega dados do cliente para exibição
      }
      else {
        this.alertas.error("Nenhum cliente ou ficha identificado.");
        this.router.navigate(['admin/painel/treinos']);
      }
    });

    // 3. Carregar Listas do Sistema (Grupos e Exercícios)
    this.carregarGrupos();
    this.carregarExercicios();
  }

  carregarGrupos() {
    this.service.pgrupo().subscribe(data => {
      this.gruposMusculares = data;
    });
  }

  carregarExercicios() {
    this.service.pexer().subscribe(data => {
      this.todosExercicios = data;
      this.configurarAutocomplete();
    });
  }

  configurarAutocomplete() {
    // Configura o filtro do autocomplete baseado no input do usuário
    this.exerciciosFiltrados = this.formExercicio.get('exercicioObj')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nome;
        return name ? this._filter(name as string) : this.todosExercicios.slice();
      })
    );
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.todosExercicios.filter(option => option.nome.toLowerCase().includes(filterValue));
  }

  displayFn(exercicio: any): string {
    return exercicio && exercicio.nome ? exercicio.nome : '';
  }

  // --- CARREGAMENTO DE DADOS (Edição e Cliente) ---

  carregarDadosFicha(): void {
    this.service.pesquisarFicha(JSON.stringify({ id: this.ficha_id })).subscribe({
      next: (dadosDaApi) => {
        if (dadosDaApi && dadosDaApi.length > 0) {
          const primeiroItem = dadosDaApi[0];

          this.formFicha.patchValue({
            tipo: primeiroItem.tipo,
            ordem: primeiroItem.ordem
          });

          this.cliente_id = primeiroItem.cliente_id; // Define o cliente da ficha a ser editada

          // Preenche a lista visual
          this.listaExercicios = dadosDaApi.map((item: any) => {
            return {
              exercicio_id: item.ficha_exercicio_id,
              exercicio_nome: item.exercicio,
              grupo_id: item.grupo_id,
              grupo_nome: item.grupo_muscular,
              series: item.series,
              repeticoes: item.repeticoes,
              observacoes: item.observacoes
            };
          });

          // Carrega infos do cliente (Anamnese, Planos...)
          this.carregarDadosCliente();

        } else {
          // Ficha existe mas tá vazia? Ou erro?
          // Se for vazia, ainda precisamos do cliente_id...
          // Mas normalmente a API retorna array vazio se não achar.
          this.alertas.warning('Ficha sem exercícios ou não encontrada.');
        }
      },
      error: (err) => {
        this.alertas.error('Erro ao carregar dados da ficha.');
        console.error(err);
      }
    });
  }

  carregarDadosCliente(): void {
    if (!this.cliente_id) return;

    // Plano
    this.clienteservice.pesquisarIdPlano(JSON.stringify({ id: this.cliente_id })).subscribe({
      next: (dados) => {
        if (Array.isArray(dados) && dados.length > 0) {
          this.planoCliente = dados[0];
        } else {
          this.planoCliente = dados;
        }
      },
      error: () => console.log("Cliente sem plano")
    });

    // Anamnese
    this.anamneseservice.readIdCliente(JSON.stringify({ id: this.cliente_id })).subscribe({
      next: (dados) => this.anamneseCliente = dados.dados,
      error: () => console.log("Cliente sem anamnese")
    });

    // Outras Fichas
    this.service.pesquisarFichaId(JSON.stringify({ id: this.cliente_id, soficha: "sim" })).subscribe({
      next: (dados) => {
        if (dados.length > 0) {
          this.fichasCliente = dados.sort((a: any, b: any) =>
            a.tipo.localeCompare(b.tipo, 'pt-BR', { sensitivity: 'base' })
          );
        } else {
          this.fichasCliente = null;
        }
      }
    });
  }

  // --- AÇÕES DO FORMULÁRIO ---

  adicionarExercicio(): void {
    if (this.formExercicio.invalid) {
      this.formExercicio.markAllAsTouched();
      return;
    }

    const { exercicioObj, series, repeticoes, observacoes } = this.formExercicio.value;

    // Validação extra caso tenha digitado algo mas não selecionado do autocomplete corretamente (se for string)
    if (typeof exercicioObj === 'string') {
      this.alertas.warning("Selecione um exercício válido da lista.");
      return;
    }

    const item = {
      // Para salvar no banco precisamos do ID do exercício
      exercicio_id: exercicioObj.id,
      exercicio_nome: exercicioObj.nome,

      grupo_id: exercicioObj.grupo_muscular_id,
      // Vamos tentar achar o nome do grupo na lista de grupos carregada
      grupo_nome: this.gruposMusculares.find(g => g.id == exercicioObj.grupo_muscular_id)?.nome || ' - ',

      series,
      repeticoes,
      observacoes
    };

    console.log("Adicionando Item:", item);

    this.listaExercicios.push(item);

    // Resetar form de exercício, mantendo talvez o grupo? Não, limpa tudo.
    this.formExercicio.reset();

    // Foco volta pro input de exercicio? Seria bom.
  }

  removerExercicio(index: number): void {
    this.listaExercicios.splice(index, 1);
  }

  // --- FINALIZAR (SALVAR) ---

  salvarFichaCompleta(): void {
    if (this.formFicha.invalid) {
      this.alertas.warning('Preencha o Tipo da Ficha e a Ordem.');
      return;
    }
    if (this.listaExercicios.length === 0) {
      this.alertas.warning('Adicione pelo menos um exercício à ficha.');
      return;
    }

    const dadosFicha = {
      exercicios: this.listaExercicios,
      ...this.formFicha.value,
      cliente_id: this.cliente_id
    };

    if (this.isEditMode) {
      // UPDATE
      // Backend espera `ficha_id` dentro do objeto para update?
      const payload = {
        ...dadosFicha,
        ficha_id: this.ficha_id
      };

      this.service.updateFicha(JSON.stringify(payload)).subscribe({
        next: (dados) => {
          this.alertas.success(dados.msg || 'Ficha atualizada com sucesso!');
          this.router.navigate(['admin/painel/treinos/ver-fichas'], { queryParams: { id: this.cliente_id } });
        },
        error: (er) => {
          this.alertas.error('Erro ao atualizar a ficha.');
          console.error(er);
        }
      });

    } else {
      // CREATE
      this.service.createFicha(JSON.stringify(dadosFicha)).subscribe({
        next: (dados) => {
          this.alertas.success(dados.msg || 'Ficha criada com sucesso!');
          this.router.navigate(['admin/painel/treinos/ver-fichas'], { queryParams: { id: this.cliente_id } });
        },
        error: (er) => {
          this.alertas.error('Erro ao criar a ficha.');
          console.error(er);
        }
      });
    }
  }

  // --- MODAIS E CREATE EXERCICIO RAPIDO ---

  // --- MODAIS E CREATE EXERCICIO RAPIDO ---

  abrirModalAnamnese() {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalAnamnese'));
    modal.show();
  }

  abrirModalCriarExercicio() {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalExer'));
    modal.show();
  }

  salvarExercicio() {
    if (!this.novoExercicio.nome || !this.novoExercicio.grupo_muscular_id) {
      this.alertas.warning("Preencha o nome e selecione o grupo muscular.");
      return;
    }

    const payload = {
      nome: this.novoExercicio.nome,
      grupo_muscular_id: this.novoExercicio.grupo_muscular_id
    };

    this.service.cadexer(JSON.stringify(payload)).subscribe({
      next: (res) => {
        this.alertas.success("Exercício criado com sucesso!");

        // Recarregar lista de exercicios para aparecer no autocomplete
        this.carregarExercicios();

        // Limpar form
        this.novoExercicio = { nome: '', grupo_muscular_id: '' };

        // Fechar modal (gambiarra via JS clean ou so hide)
        const el = document.getElementById('modalExer');
        const modal = (window as any).bootstrap.Modal.getInstance(el);
        modal.hide();
      },
      error: (err) => {
        this.alertas.error("Erro ao criar exercício.");
        console.error(err);
      }
    })
  }
}
