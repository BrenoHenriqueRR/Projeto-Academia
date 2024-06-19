<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\FinanceiroModel;
use CodeIgniter\HTTP\ResponseInterface;

class Financeiro extends BaseController
{
    protected $model;

    public function __construct()
    {
        $this->model = new FinanceiroModel();
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
            ->get();

        return $this->response->setJSON($dados->getResult())->setStatusCode(200);
    }

    public function update()
    {
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
