<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\LojaItensModel;
use App\Models\LojaProdutosModel;
use App\Models\LojaVendaModel;
use CodeIgniter\HTTP\ResponseInterface;

class Loja extends BaseController
{
    protected $lojaItens;
    protected $lojaVenda;
    protected $lojaProdutos;

    public function __construct()
    {
        $this->lojaItens = new LojaItensModel();
        $this->lojaVenda = new LojaVendaModel();
        $this->lojaProdutos = new LojaProdutosModel();
    }

    public function create()
    {
        try {
            $data = $this->request->getJSON(true);

            // Inserção no banco de dados
            $this->lojaProdutos->insert($data);

            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_CREATED)
                ->setJSON([
                    'success' => true,
                    'msg' => 'Produto cadastrado com sucesso!'
                ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON([
                    'success' => false,
                    'msg' => 'Ocorreu um erro! Tente novamente.',
                    'error' => $e->getMessage()
                ]);
        }
    }

    public function read(){
        try {
            // Inserção no banco de dados
            $dados = $this->lojaProdutos->findAll();
            return $this->response
            ->setStatusCode(ResponseInterface::HTTP_CREATED)
            ->setJSON([
                'success' => true,
                $dados
            ]);

        } catch (\Exception $e) {
            return $this->response
            ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
            ->setJSON([
                'success' => false,
                'msg' => 'Ocorreu um erro! Tente novamente.',
                'error' => $e->getMessage()
            ]);
        }
    }

    
}
