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
  problemasSaude =[ 
    { pb :  'doença cardiaca coronariana' },
    { pb :  'doença cardiaca coronariana' },
    { pb :  'doença cardiaca coronariana' },
    { pb :  'doença cardiaca coronariana' }
  ];
  sintomasLista: any;

  constructor(private fb: FormBuilder, private cliservice:PnClienteService ) {}

  ngOnInit(): void {
    this.pesquisarCli();
    this.anamneseForm = this.fb.group({
      clienteSelecionado: [null, Validators.required],
      problemasSaude: [''],
      sintomas: [''],
      medicamentos: [''],
      historicoFamiliarCardiaco: [false],
      restricaoMedica: [''],
      nivelEstresse: ['leve', Validators.required]
    });
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
