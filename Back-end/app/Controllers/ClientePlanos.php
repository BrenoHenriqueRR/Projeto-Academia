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

    public function __construct()
    {
        $this->clientesPlanosModel = new Clientesplanos();
        $this->clientesPlanosExtraModel = new ClientePlanosExtra();
        $this->planosModel = new Planos();
        $this->pagamentosModel = new PagamentosModel();
    }

    public function create($dados, $id)
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
        if (!empty($dados['extras'])) {
            $this->clientesPlanosExtraModel->insert([
                'clientes_plano_id' => $clientesPlanoId,
                'extra_id' => $dados['extras']
            ]);
        }

        return true;
    }

    public function pesquisarId()
    {
        $id = $this->request->getJSON();

        $dados = $this->clientesPlanosModel->select()
            ->where('cliente_id', $id->id)
            ->join('planos', 'clientes_planos.plano_id = planos.id')
            ->get();

        return $this->response->setJSON($dados->getResult())->setStatusCode(200);
    }

    //     CREATE TABLE clientes_planos_historico (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     cliente_plano_id INT NOT NULL,
    //     data_inicio DATE NOT NULL,
    //     data_fim DATE,
    //     status ENUM('ativo', 'expirado', 'cancelado', 'renovado') NOT NULL,
    //     observacao TEXT,
    //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    //     FOREIGN KEY (cliente_plano_id) REFERENCES clientes_planos(id)
    // );


    public function concluirPagamento()
    {
        try {
            $dados = $this->request->getJSON();

            $pagamento = $this->pagamentosModel->find($dados->id);
            $cliPlanos = $this->clientesPlanosModel->find($pagamento['cliente_planos_id']);

            if (!$pagamento || !$cliPlanos) {
                return $this->response->setJSON(['msg' => 'Pagamento ou plano não encontrado'])->setStatusCode(404);
            }

            // Expira o plano anterior e marca como pago
            $this->clientesPlanosModel
                ->update($pagamento['cliente_planos_id'], [
                    'status' => 'expirado',
                    'pago' => true
                ]);

            // Atualiza pagamento como concluído
            $this->pagamentosModel
                ->update($dados->id, [
                    'status_pagamento' => 'pago',
                    'forma_pagamento' => $dados->forma_pagamento,
                    'data_pagamento' => date('Y-m-d H:i:s')
                ]);

            // Cria novo plano
            $dataInicio = date('Y-m-d');
            $dataVencimento = date('Y-m-d', strtotime('+30 days'));

            $novoPlanoId = $this->clientesPlanosModel->insert([
                'cliente_id' => $cliPlanos['cliente_id'],
                'plano_id' => $cliPlanos['plano_id'],
                'data_inicio' => $dataInicio,
                'data_vencimento' => $dataVencimento,
                'status' => 'ativo',
                'pago' => false
            ]);

            // Cria novo pagamento pendente
            $this->novoPagamento([
                'cliente_planos_id' => $novoPlanoId,
                'valor' => $pagamento['valor'], // ou o valor atual do plano
                'funcionario_id' => $pagamento['funcionario_id']
            ]);

            return $this->response->setJSON(['msg' => 'Pagamento concluído com sucesso'])->setStatusCode(200);
        } catch (\Throwable $th) {
            return $this->response->setJSON(['msg' => 'Erro: ' . $th->getMessage()])->setStatusCode(500);
        }
    }

    public function novoPagamento($dados)
    {
        try {
            $this->pagamentosModel->insert([
                "valor" => $dados['valor'],
                "status_pagamento" => 'pendente',
                "data_pagamento" => null,
                "forma_pagamento" => null,
                "funcionario_id" => $dados['funcionario_id'],
                "cliente_planos_id" => $dados['cliente_planos_id'],
            ]);
        } catch (\Throwable $th) {
            log_message('error', 'Erro ao criar novo pagamento: ' . $th->getMessage());
        }
    }
}
