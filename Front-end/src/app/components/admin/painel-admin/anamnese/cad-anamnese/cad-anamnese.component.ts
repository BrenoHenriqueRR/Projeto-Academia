import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PnClienteService } from '../../../../../services/admin/pn-cliente/pn-cliente.service';
import { ToastrService } from 'ngx-toastr';
import { AnamneseService } from '../../../../../services/admin/anamnese/anamnese.service';

@Component({
  selector: 'app-cad-anamnese',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './cad-anamnese.component.html',
  styleUrl: './cad-anamnese.component.css'
})
export class CadAnamneseComponent {
  anamneseForm!: FormGroup;
  clientes: any;
  problemasSaude = [
    'Doença cardiaca coronariana',
    'Doença cardiaca reumática',
    'Doença cardiaca congênica',
    'Batimentos cardíacos irregulares',
    'Problemas nas válvulas cardíacas',
    'Murmúrios cardíacos',
    'Hipertensão',
    'Ataque cardíaco',
    'Epilepsia',
    'Diabetes',
    'Anguba',
    'Câncer'
  ];
  sintomasLista = [
    'Dor nas costas',
    'Dor nas articulações,tendões ou músculo',
    'Doença pulmonar(asma, enfisema, outra)'
  ];
  objetivos = [
    'Perder peso',
    'Melhorar aptidão fisica',
    'Melhorar flexibilidade',
    'Melhorar a condição muscular',
    'Reduzir as dores nas costas',
    'Reduzir o estresse',
    'Parar de fumar',
    'Diminuir colesterol',
    'Melhorar a nutruição',
    'Sentir-se melhor',
    'Outro (especifique)'
  ];

  constructor(private fb: FormBuilder, private cliservice: PnClienteService, private alert: ToastrService,
  private anamservice: AnamneseService) { }

  ngOnInit(): void {
    this.pesquisarCli();
    this.anamneseForm = this.fb.group({
      cliente_id: [null, Validators.required],
      perg_problemas_saude: this.fb.array([]),
      perg_sintomas: this.fb.array([]),
      perg_medicamentos: [''],
      perg_historico_familiar_cardiaco: [false],
      perg_restricao_medica: [],
      perg_gravida: [],
      perg_fuma: [],
      perg_bebe_alcool: [],
      perg_exercicio_frequente: [],
      perg_qtde_aerobico: [],
      perg_colesterol_medido: [],
      perg_alimentacao_balanceada: [],
      perg_gordura_alta: [],
      perg_nivel_estresse: ['leve', Validators.required],
      perg_objetivos_saude: this.fb.array([]),
      anotacoes: [],
    });
  }

  onCheckboxChange(event: any, classe: string) {
    const checkArray: FormArray = this.anamneseForm.get(classe) as FormArray;

    if (event.target.checked) {
      checkArray.push(this.fb.control(event.target.value));
    } else {
      const index = checkArray.controls.findIndex(x => x.value === event.target.value);
      checkArray.removeAt(index);
    }
  }

  onTextChange(event: any, classe: string) {
    const checkText: FormArray = this.anamneseForm.get(classe) as FormArray;

    if (event.target.value) {
      checkText.push(this.fb.control("descricao:" + event.target.value));
    } else {
      const index = checkText.controls.findIndex(x => x.value === event.target.value);
      checkText.removeAt(index);
    }
  }

  salvarAnamnese(): void {
    if (this.anamneseForm.valid) {
      let dados = this.anamneseForm.getRawValue()
      dados.perg_problemas_saude = dados.perg_problemas_saude.join(',');
      dados.perg_sintomas = dados.perg_sintomas.join(',');
      dados.perg_objetivos_saude = dados.perg_objetivos_saude.join(',');

      dados = JSON.stringify(dados);
      console.log(dados);
      this.anamservice.create(dados).subscribe({
        next: (dados) => {
          this.alert.success(dados.msg);
        }, error: (err) => {
          console.log(err);
          this.alert.error(err.msg);
        }
      })

    } else {
      this.alert.error('Preencha os campos obrigatórios!');
    }
  }

  pesquisarCli() {
    this.cliservice.pesquisarSAnam().subscribe({
      next: (dados) => {
        this.clientes = dados;
        console.log(dados);
      }, error: (err) => {
        console.log("ocorreu um erro: " + err);
      },
    })
  }
}
