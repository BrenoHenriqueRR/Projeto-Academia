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
      { id : 1, pb :  'Doença cardiaca coronariana' },
      { id : 2, pb :  'Doença cardiaca reumática' },
      { id : 3, pb :  'Doença cardiaca congênica' },
      { id : 4, pb :  'Batimentos cardíacos irregulares' },
      { id : 5, pb :  'Problemas nas válvulas cardíacas' },
      { id : 6, pb :  'Murmúrios cardíacos' },
      { id : 7, pb :  'Hipertensão' },
      { id : 8, pb :  'Ataque cardíaco' },
      { id : 9, pb :  'Epilepsia' },
      { id : 10, pb :  'Diabetes' },
      { id : 11, pb :  'Anguba' },
      { id : 12, pb :  'Câncer' },
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
