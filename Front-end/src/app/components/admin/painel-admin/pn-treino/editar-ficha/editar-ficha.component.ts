import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnamneseService } from '../../../../../services/admin/anamnese/anamnese.service';
import { PnClienteService } from '../../../../../services/admin/pn-cliente/pn-cliente.service';
import { CadTreinoService } from '../../../../../services/cad-treino/cad-treino.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../modules/material.module';
import Swal from 'sweetalert2';
import { error } from 'jquery';

@Component({
  selector: 'app-editar-ficha',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, CommonModule, MaterialModule],
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
  exercicioDigitado = '';
  mostrarCriarExercicio = false;
  novoExercicio = {
    nome: '',
    grupo_muscular_id: ''
  };

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

    this.carregarExercicios();

    // Se temos um ID de ficha, buscamos os dados para preencher o formulário
    if (this.ficha_id) {
      this.carregarDadosFicha();
    }
  }

  carregarExercicios(){
    this.service.pexer().subscribe(data => {
      this.todosExercicios = data;
    });
  }

  carregarDadosFicha(): void {
    this.service.pesquisarFicha(JSON.stringify({ id: this.ficha_id })).subscribe({
      next: (dadosDaApi) => {
        // 'dadosDaApi' é a lista de exercícios com dados da ficha repetidos
        if (dadosDaApi && dadosDaApi.length > 0) {
          // console.log(dadosDaApi);

          // 1. Pegamos os dados da Ficha do primeiro registro
          const primeiroItem = dadosDaApi[0];
          this.formFicha.patchValue({
            tipo: primeiroItem.tipo,
            ordem: primeiroItem.ordem
          });
          this.cliente_id = primeiroItem.cliente_id;

          // 2. Transformamos a lista "plana" na lista de exercícios que o componente precisa
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

          // 3. Carregamos os dados complementares do cliente
          this.carregarDadosCliente();

        } else {

          this.alertas.error('Ficha não encontrada ou não possui exercícios.');

        }
      },
      error: (err) => {
        this.alertas.error('Erro ao carregar dados da ficha.');
        console.error(err);
      }
    });
  }


  carregarDadosCliente(): void {
    this.clienteservice.pesquisarIdPlano(JSON.stringify({ id: this.cliente_id })).subscribe({
      next: (dados) => {
        this.planoCliente = dados
        console.log(dados)
      },
      error: (err) => console.log("Cliente sem plano")
    });

    this.anamneseservice.readIdCliente(JSON.stringify({ id: this.cliente_id })).subscribe({
      next: (dados) => this.anamneseCliente = dados.dados,
      error: (err) => console.log("Cliente sem anamnese")
    });

    // Para exibir as outras fichas já criadas
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

  // As funções abaixo permanecem IGUAIS!
  filtrarExercicios(): void {
    const grupoId = this.formExercicio.value.grupoMuscular;
    this.exerciciosFiltrados = this.todosExercicios.filter(e => e.grupo_muscular_id == grupoId);
    this.formExercicio.patchValue({ exercicio: '' });
  }

  adicionarExercicio(): void {
    if (this.formExercicio.invalid){
     Swal.fire({
      title: 'Error',
      text: 'Exercicio nao cadastrado, Faça o seu cadastro no sistema',
      confirmButtonColor: '#ff0000',
      
     }) 
     return;
    }

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

    console.log(item);

    this.listaExercicios.push(item);
    this.formExercicio.reset();
  }

  removerExercicio(index: number): void {
    this.listaExercicios.splice(index, 1);
  }

  selecionarExercicio(exercicio: any): void {
    this.formExercicio.patchValue({
      exercicio: exercicio.id,
      grupoMuscular: exercicio.grupo_muscular_id
    });

    this.exercicioDigitado = exercicio.nome;
    this.exerciciosFiltrados = [];
    this.mostrarCriarExercicio = false;
  }

  filtrarExerciciosPorNome(): void {
    const texto = this.exercicioDigitado?.toLowerCase() || '';
    const grupoId = this.formExercicio.value.grupoMuscular;

    this.exerciciosFiltrados = this.todosExercicios.filter(e =>
      (!grupoId || e.grupo_muscular_id == grupoId) &&
      e.nome.toLowerCase().includes(texto)
    );

    this.mostrarCriarExercicio =
      texto.length > 2 &&
      !this.todosExercicios.some(e => e.nome.toLowerCase() === texto);
  }

  onExercicioInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;

    this.exercicioDigitado = input.value;
    this.filtrarExerciciosPorNome();
  }

  abrirModalAnamnese() {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalAnamnese'));
    modal.show();
  }

  abrirModalCriarExercicio() {
    this.novoExercicio.nome = this.exercicioDigitado;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalExer'));
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

    console.log(JSON.stringify(fichaAtualizada));

    // // NOVO: Chamar o método de update no serviço
    // this.service.updateFicha(JSON.stringify(fichaAtualizada)).subscribe({
    //   next: (dados) => {
    //     this.alertas.success(dados.msg || 'Ficha atualizada com sucesso!');
    //     this.router.navigate(['admin/painel/treinos']);
    //   },
    //   error: (er) => {
    //     this.alertas.error('Erro ao atualizar a ficha.');
    //     console.error(er);
    //   }
    // });
  }

  salvarExercicio() {
    let novoExer = JSON.stringify(this.novoExercicio);
     const modalEl = document.getElementById('modalExer');
  if (!modalEl) return;
    console.log(novoExer);
    this.service.cadexer(novoExer).subscribe({
      next: (msg) => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: msg.msg,
          confirmButtonColor: '#009e15',
        });
        this.carregarExercicios();
        
       const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
      modal?.hide();

      }, error: (er) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: er.msg,
          confirmButtonColor: '#007bff',
        });
         const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
      }
    })
    this.novoExercicio = {'nome' : '', 'grupo_muscular_id' : ''};
  }
}
