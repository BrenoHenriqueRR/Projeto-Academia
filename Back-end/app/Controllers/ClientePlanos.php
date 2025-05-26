<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\ClientePlanosExtra;
use App\Models\Clientesplanos;
use App\Models\PagamentosModel;
use App\Models\Planos;
use CodeIgniter\HTTP\ResponseInterface;


class ClientePlanos extends BaseController
{
    protected $clientesPlanosModel;
    protected $clientesPlanosExtraModel;
    protected $planosModel;
    protected $pagamentosModel;
    
    public function __construct() {
        $this->clientesPlanosModel = new Clientesplanos();
        $this->clientesPlanosExtraModel = new ClientePlanosExtra();
        $this->planosModel = new Planos();
        $this->pagamentosModel = new PagamentosModel();
    }

    public function create($dados,$id)
    {
        $plano = $this->planosModel->find($dados['plano']);
        $duracao = $plano['duracao']; // mensal, trimestral, semestral, anual


        $dataInicio = date('Y-m-d');
        switch ($duracao) {
            case 'mensal':
                $dataVencimento = date('Y-m-d', strtotime('+1 month'));
                break;
            case 'trimestral':
                $dataVencimento = date('Y-m-d', strtotime('+3 months'));
                break;
            case 'semestral':
                $dataVencimento = date('Y-m-d', strtotime('+6 months'));
                break;
            case 'anual':
                $dataVencimento = date('Y-m-d', strtotime('+1 year'));
                break;
            default:
                $dataVencimento = $dataInicio; // fallback seguro
                break;
        }

        // Inserir em clientes_planos
        $this->clientesPlanosModel->insert([
            'data_inicio' => $dataInicio,
            'data_vencimento' => $dataVencimento,
            'status' => 'pendente',
            'cliente_id' => $id,
            'plano_id' => $dados['plano']
        ]);

        $id = $this->clientesPlanosModel->getInsertID();

        $this->pagamentosModel->insert([
            "valor" => $plano['preco'],
            "status_pagamento" => 'pendente',
            "data_pagamento" => Null,
            "forma_pagamento" => NULL,
            "funcionario_id" => $dados['funcionario_id'],
            "cliente_planos_id" => $id,

        ]);

        

        $clientesPlanoId = $this->clientesPlanosModel->getInsertID();
        if(!empty($dados['extras'])){
            $this->clientesPlanosExtraModel->insert([
                'clientes_plano_id' => $clientesPlanoId,
                'extra_id' => $dados['extras']
            ]);
        }

        return true;
    }

    public function pesquisarId(){
        $id = $this->request->getJSON();

        $dados = $this->clientesPlanosModel->select()
        ->where('cliente_id',$id->id)
        ->join('planos', 'clientes_planos.plano_id = planos.id')
        ->get();

        return $this->response->setJSON($dados->getResult())->setStatusCode(200);
    }
}
