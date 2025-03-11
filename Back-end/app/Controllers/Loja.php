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

    public function createSale()
    {
        try {
            $data = $this->request->getJSON(true);
            
            foreach ($data['itens'] as $item) {
                $produto = $this->lojaProdutos->find($item['produto_id']);
                if (!$produto) {
                    throw new \Exception("Produto ID {$item['produto_id']} não encontrado.");
                }
    
                // Verificar estoque disponível
                if ($produto['quantidade'] < $item['quantidade']) {
                    throw new \Exception("Estoque insuficiente para o produto ID {$item['produto_id']}.");
                }
            }
    

            // Criar a venda
            $vendaData = [
                'data_venda' => date('Y-m-d H:i:s'),
                'total' => $data['total'],
            ];
            $vendaId = $this->lojaVenda->insert($vendaData); // Inserir venda e pegar o ID gerado

            // Registrar os itens da venda
            foreach ($data['itens'] as $item) {
                $itemData = [
                    'venda_id' => $vendaId,
                    'produto_id' => $item['produto_id'],
                    'quantidade' => $item['quantidade'],
                    'preco_unitario' => $item['preco_unitario'],
                ];
                $this->lojaItens->insert($itemData); // Inserir item vendido
                
                // Atualizar o estoque
                $produto = $this->lojaProdutos->find($item['produto_id']);
                $novoEstoque = $produto['quantidade'] - $item['quantidade'];
                $this->lojaProdutos->update($item['produto_id'], ['quantidade' => $novoEstoque]); // Atualizar quantidade em estoque
            }

            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_CREATED)
                ->setJSON([
                    'success' => true,
                    'msg' => 'Venda realizada com sucesso!',
                    'venda_id' => $vendaId, // Retorna o ID da venda para referência futura
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
