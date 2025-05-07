import { Component, ViewChild } from '@angular/core';
import { ConfigService } from '../../../../services/admin/config/config.service';
import { ModalConfirmarComponent } from "../../../modais/modal-confirmar/modal-confirmar.component";
import { ModalCadastroComponent } from "../../../modais/modal-cadastro/modal-cadastro.component";
import { ToastContainerDirective, ToastNoAnimation, ToastPackage, ToastrService } from 'ngx-toastr';
import { NgFor } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pn-planos',
  standalone: true,
  imports: [ModalConfirmarComponent, ModalCadastroComponent, ReactiveFormsModule,
    NgxMaskDirective, RouterLink],
  providers: [provideNgxMask()],
  templateUrl: './pn-planos.component.html',
  styleUrl: './pn-planos.component.css'
})
export class PnPlanosComponent {
  planos: any;
  extras: any;
  loading: boolean = false;
  @ViewChild(ModalConfirmarComponent) modal?: ModalConfirmarComponent
  idDelete!: number;
  extraForm: FormGroup<any>;

  ngOnInit() {
    this.loading = true;
    this.academiaservice.pesquisarPlanos().subscribe({
      next: (dado) => {
        this.planos = dado;
        this.loading = false
      }
    })
    this.academiaservice.pesquisarPlanosExtras().subscribe({
      next: (dado) => {
        this.extras = dado;
        this.loading = false
      }
    })
  }

  constructor(private academiaservice: ConfigService, private alertas: ToastrService, private fb: FormBuilder) {
    this.extraForm = this.fb.group({
      nome_extra: ['', Validators.required],
      descricao_extra: ['', Validators.required],
      preco: ['', Validators.required],
      status: ['', Validators.required],
      plano_id: ['', Validators.required],
    });
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

  Closemodal() {
    this.ngOnInit();
  }

  excluir(id: any) {
    const jsonString: string = '{"id": "' + id + '"}';

    console.log(jsonString);
    this.academiaservice.deletePlano(jsonString).subscribe({
      next: (msg) => {
        this.alertas.success(msg.msg)
        location.reload();
      }
    })
  }

  submitForm() {
    if (this.extraForm.valid) {
      const dados = JSON.stringify(this.extraForm.getRawValue());
      console.log(dados);
      this.academiaservice.createExtras(dados).subscribe({
        next: (dado) => {
          this.alertas.success(dado.msg);
          this.extraForm.reset();
          ($('#modalextra') as any).modal('hide');
          this.ngOnInit();
        }, error: (err) => {
          this.alertas.error(err.status);
          ($('#modalextra') as any).modal('hide');
          this.ngOnInit();
        },
      })
    } else {
      this.alertas.error("Campos Vazios !!");
    }
  }
}