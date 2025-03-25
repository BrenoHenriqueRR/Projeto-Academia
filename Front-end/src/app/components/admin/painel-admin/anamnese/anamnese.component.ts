import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-anamnese',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf,NgFor],
  templateUrl: './anamnese.component.html',
  styleUrl: './anamnese.component.css'
})
export class AnamneseComponent {
  anamneseForm!: FormGroup;
  clientes: any;
  problemasSaude: { id: number; pb: string }[] = []; 
  sintomasLista: any;

  constructor(private fb: FormBuilder, private cliservice:PnClienteService ) {}

  ngOnInit(): void {
    this.pesquisarCli();
    this.anamneseForm = this.fb.group({
      clienteSelecionado: [null, Validators.required],
      problemassaude: [''],
      sintomas: [''],
      medicamentos: [''],
      historicoFamiliarCardiaco: [false],
      restricaoMedica: [''],
      nivelEstresse: ['leve', Validators.required]
    });
    this.problemasSaude =[ 
      { id : 1, pb :  'doença cardiaca coronariana' },
      { id : 2, pb :  'doença cardiaca coronariana' },
      { id : 3, pb :  'doença cardiaca coronariana' },
      { id : 4, pb :  'doença cardiaca coronariana' }
    ];
  }

  salvarAnamnese(): void {
    if (this.anamneseForm.valid) {
      console.log('Dados da anamnese:', this.anamneseForm.value);
      alert('Anamnese salva com sucesso!');
    } else {
      alert('Preencha os campos obrigatórios!');
    }
  }

  pesquisarCli(){
    this.cliservice.pesquisar().subscribe({
      next: (dados) => {
        this.clientes = dados;
      }, error: (err) => {
        console.log("ocorreu um erro: " + err);
      },
    })
  }
}
