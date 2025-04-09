import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PnClienteService } from '../../../../../services/admin/pn-cliente/pn-cliente.service';
import { ToastrService } from 'ngx-toastr';
import { AnamneseService } from '../../../../../services/admin/anamnese/anamnese.service';
import { NgFor } from '@angular/common';
import { ActivatedRoute, ActivatedRouteSnapshot, Route, Router } from '@angular/router';

@Component({
  selector: 'app-editar-anamnese',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './editar-anamnese.component.html',
  styleUrl: './editar-anamnese.component.css'
})
export class EditarAnamneseComponent {
  clientes: any;
  id: string = '';
  anamnese: any = { dados: [] };
  loading: boolean = true;
  anamneseForm!: FormGroup;
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
  ngOnInit(): void {

    this.anamneseForm = this.fb.group({
      cliente_id: [null, Validators.required],
      perg_problemas_saude: this.fb.array([]),
      perg_problemas_saude_desc: [''],

      perg_sintomas: this.fb.array([]),
      perg_sintomas_desc: [''],

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
      perg_objetivos_saude_desc: [''],

      anotacoes: [],
      id: [],
    });

    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.pesquisarAnam(JSON.stringify({ id: this.id }));
      }
    });
    // Supondo que você passe o ID da anamnese por rota ou parâmetro

  }

  constructor(private fb: FormBuilder, private cliservice: PnClienteService, private alert: ToastrService, private route: ActivatedRoute, private anamservice: AnamneseService) { }


  setFormArrayFromString(controlName: string, value: string) {
    const array = value ? value.split(',') : [];
    const formArray = this.anamneseForm.get(controlName) as FormArray;
    array.forEach(item => formArray.push(new FormControl(item.trim())));
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

  extractDescricaoECampo(campo: string) {
    const itens = campo?.split(',') || []; // separa em um array os dados
    let descricao = '';
    const campos = itens.filter(item => { // filtra e faz a verificação se o item começa com descricao: se sim ele salva na descricao
      if (item.startsWith('descricao:')) {
        descricao = item.replace('descricao:', '');
        return false; // não entra no campos
      }
      return true;
    });

    return { descricao, campos };
  }


  pesquisarAnam(id: string) {
    this.anamservice.readId(id).subscribe({
      next: (data: any) => {
        console.log(data);
        const dados = data.dados[0];
        const problemas = this.extractDescricaoECampo(dados.perg_problemas_saude);
        const objetivos = this.extractDescricaoECampo(dados.perg_objetivos_saude);
        const sintomas = this.extractDescricaoECampo(dados.perg_sintomas);
        this.anamneseForm.patchValue({
          cliente_id: dados.cliente_id,
          perg_medicamentos: dados.perg_medicamentos,
          perg_historico_familiar_cardiaco: dados.perg_historico_familiar_cardiaco,
          perg_restricao_medica: dados.perg_restricao_medica,
          perg_gravida: dados.perg_gravida,
          perg_fuma: dados.perg_fuma,
          perg_bebe_alcool: dados.perg_bebe_alcool,
          perg_exercicio_frequente: dados.perg_exercicio_frequente,
          perg_qtde_aerobico: dados.perg_qtde_aerobico,
          perg_colesterol_medido: dados.perg_colesterol_medido,
          perg_alimentacao_balanceada: dados.perg_alimentacao_balanceada,
          perg_gordura_alta: dados.perg_gordura_alta,
          perg_nivel_estresse: dados.perg_nivel_estresse,
          perg_problemas_saude_desc: problemas.descricao ,
          perg_sintomas_desc:sintomas.descricao ,
          perg_objetivos_saude_desc:objetivos.descricao,
          anotacoes: dados.anotacoes,
          id: this.id,
        });
        console.log(dados.perg_objetivos_saude);
        this.setFormArrayFromString('perg_problemas_saude', problemas.campos.join(','));
        this.setFormArrayFromString('perg_sintomas', sintomas.campos.join(','));
        this.setFormArrayFromString('perg_objetivos_saude', objetivos.campos.join(','));
        console.log(this.anamneseForm.getRawValue());
        this.loading = false;
      }, error: (err: any) => {
        this.alert.error('Erro ao carregar anamnese.');
        console.log(err)
      },
    })
  }

  atualizarAnamnese(): void {
    if (this.anamneseForm.valid) {
      let dados = this.anamneseForm.getRawValue();

      // Junta os arrays com a descrição separada (se tiver)
      dados.perg_problemas_saude = [
        ...dados.perg_problemas_saude,
        `descricao:${dados.perg_problemas_saude_desc}`
      ].filter(Boolean).join(',');

      dados.perg_sintomas = [
        ...dados.perg_sintomas,
        `descricao:${dados.perg_sintomas_desc}`
      ].filter(Boolean).join(',');

      dados.perg_objetivos_saude = [
        ...dados.perg_objetivos_saude,
        `descricao:${dados.perg_objetivos_saude_desc}`
      ].filter(Boolean).join(',');

      // Remove os campos auxiliares antes de enviar
      delete dados.perg_problemas_saude_desc;
      delete dados.perg_sintomas_desc;
      delete dados.perg_objetivos_saude_desc;

      this.anamservice.update(JSON.stringify(dados)).subscribe({
        next: (res) => {
          this.alert.success(res.msg, 'Sucesso', {
          positionClass: 'toast-top-right'
        })
        alert(res.msg);
        location.reload(); 

        },
        error: (err) => this.alert.error(err.msg)
      });
    } else {
      this.alert.error('Preencha os campos obrigatórios!');
    }
  }

}
