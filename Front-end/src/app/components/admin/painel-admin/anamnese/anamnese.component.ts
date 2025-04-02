import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { NgFor, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AnamneseService } from '../../../../services/admin/anamnese/anamnese.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';
import { ModalConfirmarComponent } from '../../../modais/modal-confirmar/modal-confirmar.component';

@Component({
  selector: 'app-anamnese',
  standalone: true,
  imports: [ReactiveFormsModule,NgxPaginationModule,RouterLink,ModalConfirmarComponent],
  templateUrl: './anamnese.component.html',
  styleUrl: './anamnese.component.css'
})
export class AnamneseComponent {
   @ViewChild(ModalConfirmarComponent) modal?: ModalConfirmarComponent
  public paginaAtual = 1;
  anamneseForm!: FormGroup;
  clientes: any;
  anamnese: any = { dados: [] };
  idDelete: any = '';

  constructor(private fb: FormBuilder, private cliservice: PnClienteService, private alert: ToastrService, private anamservice : AnamneseService) { }

  ngOnInit(): void {
    this.pesquisarCli();
    this.pesquisarAnam();

    
    // this.anamneseForm = this.fb.group({
    //   cliente_id: [null, Validators.required],
    //   perg_problemas_saude: this.fb.array([]),
    //   perg_sintomas: this.fb.array([]),
    //   perg_medicamentos: [''],
    //   perg_historico_familiar_cardiaco: [false],
    //   perg_restricao_medica: [],
    //   perg_gravida: [],
    //   perg_fuma: [],
    //   perg_bebe_alcool: [],
    //   perg_exercicio_frequente: [],
    //   perg_qtde_aerobico: [],
    //   perg_colesterol_medido: [],
    //   perg_alimentacao_balanceada: [], 
    //   perg_gordura_alta: [], 
    //   perg_nivel_estresse: ['leve', Validators.required],
    //   perg_objetivos_saude: this.fb.array([]),
    //   anotacoes: [],
    // });
  }

  openmodal(id: any) {
    this.idDelete = id;
    this.modal?.openModal();
  }

  validarmodal(confirmed: boolean) {
    if (confirmed) {
      this.excluir(this.idDelete);
    }
  }
  excluir(idDelete: any) {
    this.anamservice.delete(idDelete).subscribe({
      next: (resp) =>  {
        
      },error: (err) => {
        
      }
    })
  }

  pesquisarCli() {
    this.cliservice.pesquisar().subscribe({
      next: (dados) => {
        this.clientes = dados;
      }, error: (err) => {
        console.log("ocorreu um erro: " + err);
      },
    })
  }

  pesquisarAnam(){
    this.anamservice.read().subscribe({
      next: (dados) => {
        this.anamnese = dados;
        console.log(this.anamnese);
      }, error: (err) => {
        
      },
    })
  }
}
