import { Component } from '@angular/core';
import { Despesa, DespesasService } from '../../../../../services/admin/despesas/despesas.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../../../modules/material.module';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MaterialModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent {
  form: FormGroup;
  id?: number;
  editando = false;

  constructor(
    private fb: FormBuilder,
    private service: DespesasService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      id: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      valor: [null, [Validators.required]],
      tipo: ['fixa', Validators.required],
      data: ['', Validators.required],
      observacao: [''],
      status: ['pendente', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    console.log(this.id);
    if (this.id) {
      this.editando = true;
      this.service.readId(JSON.stringify({id: this.id})).subscribe(despesa => {
        this.form.patchValue(despesa);
      });
    }
  }

  salvar() {
    this.form.patchValue({id : this.id});
    const dados: Despesa = this.form.value;
    if (this.editando && this.id) {
      this.service.update(JSON.stringify(dados)).subscribe(() => {
        alert('Despesa atualizada!');
        this.router.navigate(['/despesas']);
      });
    } else {
      this.service.create(JSON.stringify(dados)).subscribe(() => {
        alert('Despesa cadastrada!');
        this.router.navigate(['/despesas']);
      });
    }
  }

  cancelar() {
    this.router.navigate(['/despesas']);
  }
}
