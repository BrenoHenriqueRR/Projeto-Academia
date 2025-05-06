<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\ClientePlanosExtra;
use App\Models\Clientesplanos;
use App\Models\Planos;
use CodeIgniter\HTTP\ResponseInterface;


class ClientePlanos extends BaseController
{
    protected $clientesPlanosModel;
    protected $clientesPlanosExtraModel;
    protected $planosModel;
    
    public function __construct() {
        $this->clientesPlanosModel = new Clientesplanos();
        $this->clientesPlanosExtraModel = new ClientePlanosExtra();
        $this->planosModel = new Planos();
    }

    public function create($dados,$id)
    {
    
        $plano = $this->planosModel->find($dados['plano']);
        $duracao = $plano[0]['duracao']; // mensal, trimestral, semestral, anual


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
            'status' => 'ativo',
            'cliente_id' => $id,
            'plano_id' => $dados['plano']
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
}
