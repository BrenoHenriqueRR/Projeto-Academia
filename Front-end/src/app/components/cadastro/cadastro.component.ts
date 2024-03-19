import { Component, EventEmitter, Output , Input, signal } from '@angular/core';
import { MenuHomeComponent } from '../menu-home/menu-home.component';
import { LoginComponent } from '../login/login.component';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';



@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [MenuHomeComponent, LoginComponent, RouterLink, ReactiveFormsModule],
  providers: [
    CadastroService
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  formcadastro!: FormGroup;
  @Output("enviar") onSubmit = new EventEmitter();
  loading = signal(false);

  constructor(private service: CadastroService){
    this.formcadastro = new FormGroup({
     nome: new FormControl('', [Validators.required]),
     email: new FormControl('', [Validators.required, Validators.email]),
     senha: new FormControl('', [Validators.required]),
     endereco: new FormControl('', [Validators.required]),
    });
  }
  submit(){
    this.onSubmit.emit();
    this.loading.set(true);
    if(this.formcadastro.valid){
      this.service.sendData(
        this.formcadastro.value.nome,
        this.formcadastro.value.email,
        this.formcadastro.value.senha,
        this.formcadastro.value.endereco,
        ).subscribe({
          next: () => {
            this.formcadastro.reset();
            this.loading.set(false);
          }
        })
    }
  }

}

