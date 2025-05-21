<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\DespesaModel;
use App\Models\FinanceiroModel;
use App\Models\LojaVendaModel;
use App\Models\PagamentosModel;
use CodeIgniter\HTTP\ResponseInterface;

class Financeiro extends BaseController
{
    protected $model;

    public function __construct()
    {
        $this->model = new FinanceiroModel();
    }

     public function resumo()
    {
        $mes = $this->request->getGet('mes');
        $ano = $this->request->getGet('ano');

        $pagamentoModel = new PagamentosModel();
        $despesaModel = new DespesaModel();
        $vendaModel = new LojaVendaModel();

        // Total de pagamentos
        $pagamentos = $pagamentoModel
            ->selectSum('valor')
            ->like('data_pagamento', "$ano-$mes")
            ->where('status_pagamento', 'pago')
            ->first()['valor'] ?? 0;

        // Total de vendas
        $vendas = $vendaModel
            ->selectSum('total')
            ->like('data_venda', "$ano-$mes")
            ->first()['total'] ?? 0;

        // Total de despesas
        $despesas = $despesaModel
            ->selectSum('valor')
            ->like('data', "$ano-$mes")
            ->first()['valor'] ?? 0;

        $lucro = floatval($pagamentos) + floatval($vendas) - floatval($despesas);

        return $this->response->setJSON([
            'total_pagamentos' => floatval($pagamentos),
            'total_vendas' => floatval($vendas),
            'total_despesas' => floatval($despesas),
            'lucro_liquido' => $lucro
        ]);
    }

    public function listaPagamentos()
    {
        $model = new PagamentosModel();
        $data = $model->orderBy('data_pagamento', 'DESC')->findAll();
        return $this->response->setJSON($data);
    }

    public function listaDespesas()
    {
        $model = new DespesaModel();
        $data = $model->orderBy('data', 'DESC')->findAll();
        return $this->response->setJSON($data);
    }

    public function listaVendas()
    {
        $model = new LojaVendaModel();
        $data = $model->orderBy('data_venda', 'DESC')->findAll();
        return $this->response->setJSON($data);
    }   

    public function create()
    {

        $json = file_get_contents('php://input');

        $data = json_decode($json, true);

        $valores = [
            "5" => "R$120,00",
            "3" => "R$90,00",
            "2" => "R$80,00"
        ];

        $valor = '';

        foreach ($valores as $frequencia => $preco) {
            if ($frequencia == $data['frequencia']) {
                $valor = $preco;
                break;
            }
        }

        $dados = [
            'valor' => $valor,
            'cliente_id' => $data['id'],
            'funcionario_id' => $data['funcionario_id'],
            'status_pagamento' => 'pendente',
        ];
        $query = $this->model->where('cliente_id', $data['id'])
            ->insert($dados);

        $msg = array("msg" => "Cadastro de Pagamento concluído com sucesso!!");
        return $this->response->setJSON($msg)->setStatusCode(200);
    }

    public function pesquisar()
    {
        $json = file_get_contents('php://input');

        $data = json_decode($json, true);

        $dados = $this->model->select('
        pag.id,
        pag.valor,
         pag.data_pagamento, 
         pag.data_criacao,
         pag.status_pagamento,
         pag.Tipo_id,
         pag.funcionario_id,
         c.nome,
         c.cpf'
         )
            ->from('pagamentos pag')
            ->join('cliente c','pag.cliente_id = c.id')
            ->where('pag.cliente_id', $data['cliente_id'])
            ->groupBy('c.id')
            ->get();

        return $this->response->setJSON($dados->getResult())->setStatusCode(200);
    }
    public function pesquisarCliPendente()
    {
        $json = file_get_contents('php://input');

        $data = json_decode($json, true);

        $dados = $this->model->select('
        pag.id,
        pag.valor,
         pag.data_pagamento, 
         pag.data_criacao,
         pag.status_pagamento,
         pag.funcionario_id,
         c.nome,
         p.nome,
         c.cpf,
         c.email'
         )
            ->from('pagamentos pag')
            ->join('cliente c','pag.cliente_id = c.id')
            ->join('funcionarios p','pag.funcionario_id = p.id')
            ->where('pag.status_pagamento', 'pendente')
            ->groupBy('c.id')
            ->get();

        return $this->response->setJSON($dados->getResult())->setStatusCode(200);
    }

    public function update()
    {
        date_default_timezone_set('America/Sao_Paulo');
        
        $json = file_get_contents('php://input');

        $data = json_decode($json, true);

        if ($data['status_pagamento'] == 'success') {
            $this->model->where('cliente_id', $data['cliente_id'])
                ->set([
                    'status_pagamento' => $data['status_pagamento'],
                    'data_pagamento' =>  date('Y-m-d H:i:s'),
                ])
                ->update();
        } else if ($data['status_pagamento'] == 'cancel') {
            $this->model->where('id', $data['cliente_id'])
                ->set([
                    'status_pagamento' => $data['status_pagamento']
                ])
                ->update();
        }
        return $this->response->setJSON("Concluido com sucesso !")->setStatusCode(200);
    }
}
