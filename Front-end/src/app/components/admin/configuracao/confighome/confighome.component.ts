import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../../services/admin/config/config.service';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ModalSpinnerComponent } from '../../../modal-spinner/modal-spinner.component';

@Component({
  selector: 'app-confighome',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass, ReactiveFormsModule, NgxMaskDirective, ModalSpinnerComponent],
  templateUrl: './confighome.component.html',
  providers: [provideNgxMask()],
  styleUrl: './confighome.component.css'
})
export class ConfighomeComponent implements OnInit {

  showSpinner = true;
  currentStep: number = 1;
  planForm: FormGroup;
  cadForm: FormGroup;
  fileName: string = 'Nenhum arquivo selecionado';
  logofile: any;
  msg!: any;
loading: boolean = false;

  // @HostListener('window:beforeunload', ['$event']) // ouvir eventos do navegador, sendo de janela
  // unloadNotification($event: any): void {
  //     $event.returnValue = 'Você tem alterações não salvas! Tem certeza que deseja sair?';
  // }

  ngOnInit() { 
    
    this.academiaservice.pesquisar().subscribe({
      next: (dado)=>{
        if(dado == 0){
          this.currentStep = 1;
          this.loading = true;
          setTimeout(() => {
            this.loading = false
          }, 1000);
        }else{
          this.currentStep = parseInt(dado[0].etapa_atual) + 1;
          this.loading = true;
          setTimeout(() => {
            this.loading = false
          }, 100);
        }
      }
    })
  }

  constructor(private fb: FormBuilder, private academiaservice: ConfigService, private alertas: ToastrService) {
    this.planForm = this.fb.group({
      nomePlano: ['', Validators.required],
      precoPlano: ['', Validators.required],
      descontoPlano: ['', [Validators.required, Validators.min(1)]],
      descricaoPlano: ['', [Validators.required]],
      duracaoPlano: ['', [Validators.required]],
      beneficiosPlano: ['', [Validators.required]],
      disponibilidadePlano: ['', [Validators.required]]
    });
    this.cadForm = this.fb.group({
      logo: ['', Validators.required],
      nomeAcad: ['', Validators.required],
      horarioFuncionamento: ['', Validators.required],
      telefoneAcademia: ['', Validators.required],
      emailAcademia: ['', [Validators.required, Validators.email]],
      descricaoAcad: ['', Validators.required],
      endereco: ['', Validators.required],
      cnpj: ['', Validators.required],
    });
  }


  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
      this.logofile = input.files[0];
    } else {
      this.fileName = 'Nenhum arquivo selecionado';
    }
  }

  onSubmit(): void {
    if (this.planForm.valid) {
      console.log('Form Submitted', this.planForm.value);
      // Aqui você pode adicionar o código para enviar o formulário para o servidor ou fazer outra ação desejada
    }
  }

  salvarConfiguracoes() {
    if (this.cadForm.valid) {
      const formData = new FormData();
      formData.append('logo', this.logofile, this.logofile.name);
      formData.append('nomeAcad', this.cadForm.value.nomeAcad);
      // formData.append('horarioFuncionamento', this.cadForm.value.horarioFuncionamento);
      formData.append('telefoneAcademia', this.cadForm.value.telefoneAcademia);
      formData.append('emailAcademia', this.cadForm.value.emailAcademia);
      formData.append('descricaoAcad', this.cadForm.value.descricaoAcad);
      formData.append('endereco', this.cadForm.value.endereco);
      formData.append('cnpj', this.cadForm.value.cnpj);
      this.academiaservice.create(formData).subscribe({
        next: (dado) => {
          this.alertas.success(dado.msg);
          this.Proximo();
        }, error: (err) => {
          this.alertas.error("Ocorreu um Erro!");
          console.error(err);
        },
      })
    } else {
      this.alertas.error('Preencha os campos antes de salvar!!');
    }
  }

  Proximo() {
    this.currentStep++;
    this.loading = true;
    setTimeout(() => {
      this.loading = false
    }, 100);
  }

  Anterior() {
    this.currentStep--;
  }

  adicionarNovoPlano() {

  }

  salvarPlano() {
    console.log(this.planForm.getRawValue());
  }
}
