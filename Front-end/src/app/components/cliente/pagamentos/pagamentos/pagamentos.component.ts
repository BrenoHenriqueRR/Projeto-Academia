import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Stripe, loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-pagamentos',
  standalone: true,
  imports: [],
  templateUrl: './pagamentos.component.html',
  styleUrl: './pagamentos.component.css'
})
export class PagamentosComponent {
  private stripe: Stripe | null = null;
  check: any;
  validarPag!: string;

  constructor(private route: ActivatedRoute) {
    this.initializeStripe();
    this.route.queryParams.subscribe(params => {
      this.check = params['checkout'];
    });
    if(this.check == 'success'){
      alert("Pagamento bem sucedido");
      this.validarPag = 'success'

    }else if (this.check == 'cancel'){
      alert("pagamento cancelado");
      this.validarPag = 'cancel'
    }
  }

  async initializeStripe() {
    this.stripe = await loadStripe('pk_test_51PIgs5C3FpK3s0UHz5leeV4uVk9fLuBwelrGqZCpWMah6SeM3uuUpgm5ZwHu0myGCY9DESO4Q2FSZddcWnZKqAsN00RaC9hfHI'); 
  }

  async pagar() {
    
    if (this.stripe) {
      const { error } = await this.stripe.redirectToCheckout({
        lineItems: [{ price: 'price_1PIh9xC3FpK3s0UH0d0he8vV', quantity: 1 }], 
        mode: 'subscription',
        successUrl: `${window.location.href}?checkout=success`,
        cancelUrl: `${window.location.href}?checkout=cancel`
      });
      if (error) {
        alert("Erro no pagamento")
      } 
    }
  }
}
