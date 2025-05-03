<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\LojaItensModel;
use App\Models\LojaProdutosModel;
use App\Models\LojaVendaModel;
use CodeIgniter\HTTP\ResponseInterface;

date_default_timezone_set('America/Sao_Paulo');

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

            foreach ($data['produtos'] as $item) {
                $produto = $this->lojaProdutos->find($item['id']);
                if (!$produto) {
                    throw new \Exception("Produto ID {$item['id']} não encontrado.");
                }

                // Verificar estoque disponível
                if ($produto['quantidade'] < $item['qtd']) {
                    throw new \Exception("Estoque insuficiente para o produto ID {$item['produto_id']}.");
                }
            }


            // Criar a venda
            $vendaData = [
                'data_venda' => date('Y-m-d H:i:s'),
                'total' => $data['total'],
                'forma_pagamento' => $data['pagamento'],
            ];
            $vendaId = $this->lojaVenda->insert($vendaData); // Inserir venda e pegar o ID gerado

            // Registrar os itens da venda
            foreach ($data['produtos'] as $item) {
                $itemData = [
                    'venda_id' => $vendaId,
                    'produto_id' => $item['id'],
                    'quantidade' => $item['qtd'],
                    'valor_unitario' => $item['preco'],
                ];
                $this->lojaItens->insert($itemData); // Inserir item vendido

                // Atualizar o estoque
                $produto = $this->lojaProdutos->find($item['id']);
                $novoEstoque = $produto['quantidade'] - $item['qtd'];
                $this->lojaProdutos->update($item['id'], ['quantidade' => $novoEstoque]); // Atualizar quantidade em estoque
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

    public function read()
    {
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

    public function getVendas()
    {
        try {

            // Buscar todas as vendas
            $vendas = $this->lojaVenda->findAll();

            if (empty($vendas)) {
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_OK)
                    ->setJSON([
                        'success' => true,
                        'msg' => 'Nenhuma venda encontrada.',
                        'data' => [],
                    ]);
            }

            // Iterar sobre as vendas para buscar os itens
            foreach ($vendas as &$venda) {
                // Buscar os itens da venda
                $itens = $this->lojaItens
                    ->where('venda_id', $venda['id'])
                    ->findAll();

                // Buscar detalhes dos produtos para cada item
                foreach ($itens as &$item) {
                    $produto = $this->lojaProdutos->find($item['produto_id']);
                    $item['produto_nome'] = $produto['nome'] ?? 'Produto não encontrado';
                    $item['produto_preco'] = $produto['preco'] ?? 0;
                }

                // Adicionar os itens na venda
                $venda['itens'] = $itens;
            }

            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_OK)
                ->setJSON([
                    'success' => true,
                    'msg' => 'Vendas encontradas com sucesso!',
                    'data' => $vendas,
                ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON([
                    'success' => false,
                    'msg' => 'Ocorreu um erro ao buscar as vendas.',
                    'error' => $e->getMessage(),
                ]);
        }
    }

    public function getVendasData()
    {
        try {
            $startDate = $this->request->getGet('start_date');
            $endDate = $this->request->getGet('end_date');

            // Validar se as datas foram enviadas
            if (!$startDate || !$endDate) {
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_BAD_REQUEST)
                    ->setJSON([
                        'success' => false,
                        'msg' => 'As datas de início e fim são obrigatórias!',
                    ]);
            }

            // Buscar as vendas no intervalo de datas
            $vendas = $this->lojaVenda
                ->where('data_venda >=', $startDate . ' 00:00:00')
                ->where('data_venda <=', $endDate . ' 23:59:59')
                ->findAll();

            if (empty($vendas)) {
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_OK)
                    ->setJSON([
                        'success' => true,
                        'msg' => 'Nenhuma venda encontrada nesse período.',
                        'data' => [],
                    ]);
            }

            // Iterar sobre as vendas para buscar os itens e detalhes dos produtos
            foreach ($vendas as &$venda) {
                $itens = $this->lojaItens
                    ->where('venda_id', $venda['id'])
                    ->findAll();

                foreach ($itens as &$item) {
                    $produto = $this->lojaProdutos->find($item['produto_id']);
                    $item['produto_nome'] = $produto['nome'] ?? 'Produto não encontrado';
                    $item['produto_preco'] = $produto['preco'] ?? 0;
                }

                $venda['itens'] = $itens;
            }

            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_OK)
                ->setJSON([
                    'success' => true,
                    'msg' => 'Vendas encontradas com sucesso!',
                    'data' => $vendas,
                ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON([
                    'success' => false,
                    'msg' => 'Ocorreu um erro ao buscar as vendas.',
                    'error' => $e->getMessage(),
                ]);
        }
    }

    public function deleteProduto(){
        try {
            $dados = $this->request->getJSON();
            $this->lojaProdutos->delete($dados->id);
            return $this->response
            ->setStatusCode(ResponseInterface::HTTP_OK)
            ->setJSON([
                'success' => true,
                'msg' => 'Produto Excluido com sucesso!',
            ]);

        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON([
                    'success' => false,
                    'msg' => 'Ocorreu um erro ao excluir o Produto.',
                    'error' => $e->getMessage(),
                ]);
        }
    }

    public function editProduto(){
        try {
            $dados = $this->request->getJSON();
            $this->lojaProdutos->update($dados->id,$dados);
            return $this->response
            ->setStatusCode(ResponseInterface::HTTP_OK)
            ->setJSON([
                'success' => true,
                'msg' => 'Produto Editado com sucesso!',
            ]);

        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON([
                    'success' => false,
                    'msg' => 'Ocorreu um erro ao editar o Produto.',
                    'error' => $e->getMessage(),
                ]);
        }
    }
}
