import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { NgFor, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AnamneseService } from '../../../../services/admin/anamnese/anamnese.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';
import { ModalConfirmarComponent } from '../../../modais/modal-confirmar/modal-confirmar.component';
import { ModalSpinnerComponent } from '../../../modais/modal-spinner/modal-spinner.component';

@Component({
  selector: 'app-anamnese',
  standalone: true,
  imports: [ReactiveFormsModule,NgxPaginationModule,RouterLink,ModalConfirmarComponent,ModalSpinnerComponent,NgIf],
  templateUrl: './anamnese.component.html',
  styleUrl: './anamnese.component.css'
})
export class AnamneseComponent {
   @ViewChild(ModalConfirmarComponent) modal?: ModalConfirmarComponent
  public paginaAtual = 1;
  anamneseForm!: FormGroup;
  clientes: any;
  anamnese: any = { dados: [] };
  loading: boolean = true;
  idDelete: any = '';

  constructor(private fb: FormBuilder, private cliservice: PnClienteService, private alert: ToastrService, private anamservice : AnamneseService) { }

  ngOnInit(): void {
    this.pesquisarCli();
    this.pesquisarAnam();
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
        this.alert.success(resp.msg);
        this.ngOnInit();
      },error: (err) => {
        console.log(err);
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
        // console.log(this.anamnese);
        this.loading = false;
      }, error: (err) => {
        console.log(err)
      },
    })
  }
}
