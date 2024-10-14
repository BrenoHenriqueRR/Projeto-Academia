<?php
namespace App\Controllers;

use App\Models\Planos;
use CodeIgniter\RESTful\ResourceController;
use Stripe\Stripe;
use Stripe\StripeClient;
use Stripe\PaymentMethod;
use Stripe\Util\Set;

class StripeController extends ResourceController
{
    protected $planosmodel;

    public function __construct()
    {
        $this->planosmodel = new Planos();
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

        var_dump($payments);
        die();

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

    public function gerarPagamento(){
        $data = $this->request->getJSON();

        $dados = $this->planosmodel->find($data->id);

        $url = $this->checkout($dados); 
        print_r($url);
    }

    public function checkout($dados)
    {
        // Configurar o Stripe
        $stripe = new StripeClient('sk_test_51PIgs5C3FpK3s0UHNwKtgs2i42mMZg3HOudiunZsLwD1Nesg99Im7iFcILyKLwF84I9xmYMXVwHwIlmITZjTV6cd005dIICHsG');

        // Criar a sessão de checkout
        $checkout_session = $stripe->checkout->sessions->create([
            'line_items' => [[    
                'price_data' => [
                  'currency' => 'brl',
                  'product_data' => [
                    'name' => 'Plano' . ' ' . $dados['nome'],
                  ],
                  'unit_amount' => $dados['preco'] * 100, // em centavos, ou seja, $20.00
                ],
                'quantity' => 1,
              ]],
            'mode' => 'payment',
            'success_url' => base_url('StripeController/success'),
            'cancel_url' => base_url('StripeController/cancel'),
        ]);

        

        // Redireciona para a URL do Stripe
        // return redirect()->to($checkout_session->url);
        return $this->response->setJSON(["url" => $checkout_session->url])->setStatusCode(200);
    }

    public function success()
    {
        // Página de sucesso após o pagamento
        echo "Pagamento concluído com sucesso!";
    }

    public function cancel()
    {
        // Página de cancelamento
        echo "O pagamento foi cancelado.";
    }
}

