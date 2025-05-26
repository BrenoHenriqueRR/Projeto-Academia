<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\AcademiaModel;
use App\Models\DespesaModel;
use App\Models\FinanceiroModel;
use App\Models\LojaVendaModel;
use App\Models\LojaVendaItemModel;
use App\Models\PagamentosModel;
use App\Models\ClienteModel;
use App\Models\FuncionariosModel;
use App\Models\LojaItensModel;
use App\Models\LojaVendaItensModel;
use CodeIgniter\HTTP\ResponseInterface;
use Dompdf\Dompdf;
use Dompdf\Options;

class Financeiro extends BaseController
{
    protected $model;
    protected $pagamentoModel;
    protected $despesaModel;
    protected $vendaModel;
    protected $academiaModel;

    public function __construct()
    {
        $this->model = new FinanceiroModel();
        $this->pagamentoModel = new PagamentosModel();
        $this->vendaModel = new LojaVendaModel();
        $this->despesaModel = new DespesaModel();
        $this->academiaModel = new AcademiaModel();
    }

    public function resumo()
    {
        $mes = $this->request->getGet('mes');
        $ano = $this->request->getGet('ano');


        // Total de pagamentos com status 'pago' ou 'success'
        $pagamentos = $this->pagamentoModel
            ->select('SUM(CAST(REPLACE(REPLACE(valor, "R$", ""), ",", ".") AS DECIMAL(10,2)))', 'total_valor')
            ->like('data_pagamento', "$ano-$mes")
            ->groupStart()
            ->where('status_pagamento', 'pago')
            ->orWhere('status_pagamento', 'success')
            ->groupEnd()
            ->first()['total_valor'] ?? 0;

        // Total de vendas
        $vendas = $this->vendaModel
            ->select('SUM(total) AS total')
            ->like('data_venda', "$ano-$mes", 'after')
            ->first()['total'] ?? 0;

        // Total de despesas
        $despesas = $this->despesaModel
            ->select('SUM(valor) as valor')
            ->like('data', "$ano-$mes", 'after')
            ->first()['valor'] ?? 0;

        $lucro = floatval($pagamentos) + floatval($vendas) - floatval($despesas);

        // Dados adicionais para análise
        $totalClientes = (new ClienteModel())
            ->where('status', 'ativo')
            ->countAllResults();

        $pagamentosPendentes = $this->pagamentoModel
            ->where('status_pagamento', 'pendente')
            ->countAllResults();

        return $this->response->setJSON([
            'total_pagamentos' => floatval($pagamentos),
            'total_vendas' => floatval($vendas),
            'total_despesas' => floatval($despesas),
            'lucro_liquido' => $lucro,
            'total_clientes_ativos' => $totalClientes,
            'pagamentos_pendentes' => $pagamentosPendentes,
            'periodo' => [
                'mes' => $mes,
                'ano' => $ano,
                'nome_mes' => $this->getNomeMes($mes)
            ]
        ]);
    }

    public function listaPagamentos()
    {

        $data = $this->pagamentoModel
            ->select('
        pagamentos.id,
        pagamentos.valor,
        pagamentos.data_pagamento,
        pagamentos.data_criacao,
        pagamentos.status_pagamento,
        cliente.nome,
        cliente.CPF as cpf,
        cliente.email,
        clientes_planos.data_vencimento,
        funcionarios.nome as funcionario_nome
    ')
            ->join('clientes_planos', 'pagamentos.cliente_planos_id = clientes_planos.id', 'left')
            ->join('cliente', 'clientes_planos.cliente_id = cliente.id', 'left')
            ->join('funcionarios', 'pagamentos.funcionario_id = funcionarios.id', 'left')
            ->orderBy('pagamentos.data_criacao', 'DESC')
            ->findAll();


        return $this->response->setJSON($data);
    }

    public function listaDespesas()
    {
        $data = $this->despesaModel
            ->orderBy('data', 'DESC')
            ->findAll();

        return $this->response->setJSON($data);
    }

    public function listaVendas()
    {
        $itemModel = new LojaItensModel();

        $vendas = $this->vendaModel
            ->orderBy('data_venda', 'DESC')
            ->findAll();

        // Adicionar itens para cada venda (opcional, pode ser pesado)
        foreach ($vendas as &$venda) {
            $itens = $itemModel
                ->select('
                    loja_vendas_itens.*,
                    loja_produtos.nome as produto_nome
                ')
                ->join('loja_produtos', 'loja_vendas_itens.produto_id = loja_produtos.id', 'left')
                ->where('venda_id', $venda['id'])
                ->findAll();

            $venda['itens'] = $itens;
            $venda['total_itens'] = count($itens);
        }

        return $this->response->setJSON($vendas);
    }

    public function estatisticasComparativas()
    {
        $ano = $this->request->getGet('ano') ?? date('Y');


        $estatisticas = [];

        for ($mes = 1; $mes <= 12; $mes++) {
            $mesFormatado = str_pad($mes, 2, '0', STR_PAD_LEFT);

            // Pagamentos do mês
            $pagamentos = $this->pagamentoModel
                ->select('SUM(CAST(REPLACE(REPLACE(valor, "R$", ""), ",", ".")) AS DECIMAL(10,2))', 'total_valor')
                ->like('data_pagamento', "$ano-$mesFormatado")
                ->groupStart()
                ->where('status_pagamento', 'pago')
                ->orWhere('status_pagamento', 'success')
                ->groupEnd()
                ->first()['total_valor'] ?? 0;

            // Vendas do mês
            $vendas = $this->vendaModel
                ->select('SUM(total)')
                ->like('data_venda', "$ano-$mesFormatado")
                ->first()['total'] ?? 0;

            // Despesas do mês
            $despesas = $this->despesaModel
                ->select('SUM(valor)')
                ->like('data', "$ano-$mesFormatado")
                ->first()['valor'] ?? 0;

            $estatisticas[] = [
                'mes' => $mes,
                'nome_mes' => $this->getNomeMes($mes),
                'receitas' => floatval($pagamentos) + floatval($vendas),
                'pagamentos' => floatval($pagamentos),
                'vendas' => floatval($vendas),
                'despesas' => floatval($despesas),
                'lucro' => floatval($pagamentos) + floatval($vendas) - floatval($despesas)
            ];
        }

        return $this->response->setJSON($estatisticas);
    }

    public function relatorioCompleto()
    {
        $mes = $this->request->getGet('mes');
        $ano = $this->request->getGet('ano');

        // Buscar todos os dados para o relatório
        $resumo = $this->getResumoData($mes, $ano);
        $pagamentos = $this->getPagamentosData($mes, $ano);
        $despesas = $this->getDespesasData($mes, $ano);
        $vendas = $this->getVendasData($mes, $ano);

        $relatorio = [
            'periodo' => [
                'mes' => $mes,
                'ano' => $ano,
                'nome_mes' => $this->getNomeMes($mes)
            ],
            'resumo' => $resumo,
            'detalhes' => [
                'pagamentos' => $pagamentos,
                'despesas' => $despesas,
                'vendas' => $vendas
            ],
            'gerado_em' => date('Y-m-d H:i:s')
        ];

        return $this->response->setJSON($relatorio);
    }

    public function exportarExcel()
    {
        // Este método seria implementado para gerar arquivo Excel
        // Por enquanto, retorna os dados em JSON
        $json = file_get_contents('php://input');
        $dados = json_decode($json, true);

        // Aqui você implementaria a geração do arquivo Excel
        // usando uma biblioteca como PhpSpreadsheet

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Dados preparados para exportação',
            'dados' => $dados
        ]);
    }

    // Métodos auxiliares privados
    private function getNomeMes($numeroMes)
    {
        $meses = [
            1 => 'Janeiro',
            2 => 'Fevereiro',
            3 => 'Março',
            4 => 'Abril',
            5 => 'Maio',
            6 => 'Junho',
            7 => 'Julho',
            8 => 'Agosto',
            9 => 'Setembro',
            10 => 'Outubro',
            11 => 'Novembro',
            12 => 'Dezembro'
        ];

        return $meses[(int)$numeroMes] ?? 'Mês Inválido';
    }

    private function getResumoData($mes, $ano)
    {
        $pagamentos = $this->pagamentoModel
            ->select("SUM(valor) AS total_valor")
            ->like('data_pagamento', "$ano-$mes")
            ->groupStart()
            ->where('status_pagamento', 'pago')
            ->orWhere('status_pagamento', 'success')
            ->groupEnd()
            ->first()['total_valor'] ?? 0;

        $vendas = $this->vendaModel
            ->select('SUM(total) AS total')
            ->like('data_venda', "$ano-$mes")
            ->first()['total'] ?? 0;

        $despesas = $this->despesaModel
            ->select('SUM(valor) AS valor')
            ->like('data', "$ano-$mes")
            ->first()['valor'] ?? 0;

        return [
            'total_pagamentos' => floatval($pagamentos),
            'total_vendas' => floatval($vendas),
            'total_despesas' => floatval($despesas),
            'lucro_liquido' => floatval($pagamentos) + floatval($vendas) - floatval($despesas)
        ];
    }


    private function getPagamentosData($mes, $ano)
    {

        return $this->pagamentoModel
            ->select('
                pagamentos.*,
                cliente.nome,
                cliente.CPF as cpf
            ')
            ->join('clientes_planos', 'pagamentos.cliente_planos_id = clientes_planos.id', 'left')
            ->join('cliente', 'clientes_planos.cliente_id = cliente.id', 'left')
            ->like('data_pagamento', "$ano-$mes")
            ->orderBy('data_pagamento', 'DESC')
            ->findAll();
    }

    private function getDespesasData($mes, $ano)
    {
        $this->despesaModel = new DespesaModel();

        return $this->despesaModel
            ->like('data', "$ano-$mes")
            ->orderBy('data', 'DESC')
            ->findAll();
    }

    private function getVendasData($mes, $ano)
    {

        return $this->vendaModel
            ->like('data_venda', "$ano-$mes")
            ->orderBy('data_venda', 'DESC')
            ->findAll();
    }

    public function gerarRelatorioMensalPdf()
    {
        $mes = $this->request->getGet('mes');
        $ano = $this->request->getGet('ano');

        $academia = $this->academiaModel->first();

        // Buscar os dados para o relatório
        $resumo = $this->getResumoData($mes, $ano);
        $pagamentos = $this->getPagamentosData($mes, $ano);
        $despesas = $this->getDespesasData($mes, $ano);
        $vendas = $this->getVendasData($mes, $ano);
        $nomeMes = $this->getNomeMes($mes);

        // Carregar o CSS do arquivo
        $css = file_get_contents(FCPATH . 'assets/css/relatorio_financeiro_mensal.css');

        // Criação de HTML com a nova view
        $html = view('Relatorios/relatorio_financeiro_mensal', [
            'resumo' => $resumo,
            'pagamentos' => $pagamentos,
            'despesas' => $despesas,
            'vendas' => $vendas,
            'mes' => $mes,
            'ano' => $ano,
            'nome_mes' => $nomeMes,
            'gerado_em' => date('d/m/Y H:i:s'),
            'nome_academia' => $academia['nome'],
            'cnpj_academia' => $academia['cnpj'],
            'email_academia' => $academia['email'],
            'logo_academia' => $academia['logo'],
            'telefone_academia' => $academia['telefone'],

        ]);

        $options = new Options();
        // $options->set('defaultFont', 'DejaVu Sans');
        $options->set('isRemoteEnabled', true); // Mudei para false
        $options->set('isHtml5ParserEnabled', true);
        $options->set('enable_font_subsetting', true);
        $options->set('debugKeepTemp', false);
        $options->set('debugCss', false);
        $options->set('debugLayout', false);
        $options->set('debugLayoutLines', false);
        $options->set('debugLayoutBlocks', false);
        $options->set('debugLayoutInline', false);
        $options->set('debugLayoutPaddingBox', false);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml('<meta charset="UTF-8"><style>' . $css . '</style>' . $html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        // Baixar o PDF diretamente
        $nomeArquivo = 'relatorio-financeiro-' . $nomeMes . '-' . $ano . '.pdf';

        return $this->response
            ->setHeader('Content-Type', 'application/pdf')
            ->setHeader('Content-Disposition', 'inline; filename="' . $nomeArquivo . '"')
            ->setBody($dompdf->output());
    }

    
}
