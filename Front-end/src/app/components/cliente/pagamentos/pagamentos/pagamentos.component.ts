import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { PnFinanceiroService } from '../../../../services/admin/pn-financeiro/pn-financeiro.service';
import { ModalComprovanteComponent } from '../../../modal-comprovante/modal-comprovante.component';

@Component({
  selector: 'app-pagamentos',
  standalone: true,
  imports: [ModalComprovanteComponent],
  templateUrl: './pagamentos.component.html',
  styleUrl: './pagamentos.component.css'
})
export class PagamentosComponent {
  @ViewChild(ModalComprovanteComponent) modal?: ModalComprovanteComponent

  private stripe: Stripe | null = null;
  check: any;
  validarPag!: string;
  pagamentos!: any;
  idcli: any = localStorage.getItem('idcliente');


  constructor(private route: ActivatedRoute, private service: PnFinanceiroService,private router: Router) {
    this.pesquisarpag();
    this.initializeStripe();
    this.route.queryParams.subscribe(params => {
      this.check = params['checkout'];
    });
    if (this.check == 'success') {
      if (this.check == 'success') {
        alert("Pagamento bem sucedido");
        this.validarPag = 'success';
        this.updatePag();
  
        // Navegar para a mesma rota sem parâmetros
        this.router.navigate([], {
          queryParams: {},
          replaceUrl: true
        });
      } else if (this.check == 'cancel') {
        alert("Pagamento cancelado");
        this.validarPag = 'cancel';
        this.updatePag();
  
        // Navegar para a mesma rota sem parâmetros
      }
    }
  }

  openModal(){
    this.modal?.openModal();
  }

  validarmodal(confirmed: boolean){
    if (confirmed) {
     console.log(true);
    }
  }

  async initializeStripe() {
    this.stripe = await loadStripe('pk_test_51PIgs5C3FpK3s0UHz5leeV4uVk9fLuBwelrGqZCpWMah6SeM3uuUpgm5ZwHu0myGCY9DESO4Q2FSZddcWnZKqAsN00RaC9hfHI');
  }

  async pagar(valor: any) {

    const pricevalor: any = {
      'R$120,00': 'price_1PIh9xC3FpK3s0UH0d0he8vV',
      'R$90,00': 'price_1PIh9EC3FpK3s0UHWcTVuVw7',
      'R$80,00': 'price_1PIh78C3FpK3s0UHDd4ULbHj'
    };
    
    if (this.stripe) {
      const priceId = pricevalor[valor];
      if (priceId) {
        const { error } = await this.stripe.redirectToCheckout({
          lineItems: [{ price: priceId, quantity: 1 }],
          mode: 'subscription',
          successUrl: `${window.location.href}?checkout=success`,
          cancelUrl: `${window.location.href}?checkout=cancel`,
        });
        if (error) {
          alert("Erro no pagamento");
        }
      } else {
        alert("Valor inválido");
      }
    }
    
  }

  pesquisarpag() {
    const idjson: string = '{"cliente_id": "' + localStorage.getItem('idcliente') + '"}';
    this.service.pesquisar(idjson).subscribe({
      next: (dados) => {
        this.pagamentos = dados;

        for (let index = 0; index < dados.length; index++) {
          this.pagamentos[index].data_criacao = this.pagamentos[index].data_criacao.split(" ")[0];
        }
      },
    })
  }

  

  updatePag(){
    const pagamento = {
      status_pagamento: this.validarPag,
      cliente_id: localStorage.getItem('idcliente')
    };
    
    const pagjson: string = JSON.stringify(pagamento);
    this.service.update(pagjson).subscribe({
      next: (dados) => {
        console.log(dados.msg);
        this.router.navigate(['/home-cliente']),{
        };
      },
    })
  }
}
