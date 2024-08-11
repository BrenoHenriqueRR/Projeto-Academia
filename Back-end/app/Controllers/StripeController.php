<?php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use Stripe\Stripe;
use Stripe\PaymentMethod;

class StripeController extends ResourceController
{
    public function __construct()
    {
        // Chave secreta do Stripe
        Stripe::setApiKey('sk_test_51PIgs5C3FpK3s0UHNwKtgs2i42mMZg3HOudiunZsLwD1Nesg99Im7iFcILyKLwF84I9xmYMXVwHwIlmITZjTV6cd005dIICHsG');
    }

    public function getPagamentos()
    {
        $start_of_month = strtotime('first day of this month');
        $end_of_month = strtotime('last day of this month');

        // Consulta os métodos de pagamento no Stripe
        $payments = \Stripe\PaymentIntent::all([
            'created' => [
                'gte' => $start_of_month,
                'lt' => $end_of_month,
            ],
        ]);

        // Processa os dados dos pagamentos
        $total = 0;
        foreach ($payments->data as $payment) {
            $preco = $payment->amount / 100; // Valor em centavos
            $currency = strtoupper($payment->currency);
            $description = $payment->description;

            $total +=  $preco;
        }
        $data = array(['preco' => $total]);

        return $this->response->setJSON($data)->setStatusCode(200);
    }
}

