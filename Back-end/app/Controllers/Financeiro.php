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
    protected $clientemodel;

    public function __construct()
    {
        $this->model = new FinanceiroModel();
        $this->pagamentoModel = new PagamentosModel();
        $this->vendaModel = new LojaVendaModel();
        $this->despesaModel = new DespesaModel();
        $this->academiaModel = new AcademiaModel();
        $this->clientemodel = new ClienteModel();
    }

    public function resumo()
    {
        $dataInicioParam = $this->request->getGet('data_inicio');
        $dataFimParam = $this->request->getGet('data_fim');

        if ($dataInicioParam && $dataFimParam) {
            $dataInicio = date('Y-m-d', strtotime($dataInicioParam));
            $dataFim = date('Y-m-d', strtotime($dataFimParam));
        } else {

            $mes = $this->request->getGet('mes') ?? date('m');
            $ano = $this->request->getGet('ano') ?? date('Y');
            $dataInicio = "$ano-$mes-01";
            $dataFim = date('Y-m-t', strtotime($dataInicio)); // 't' retorna o último dia do mês
        }


        $pagamentos = $this->pagamentoModel
            ->select('SUM(CAST(REPLACE(REPLACE(valor, "R$", ""), ",", ".") AS DECIMAL(10,2))) AS total_valor')
            ->where('data_pagamento >=', $dataInicio)
            ->where('data_pagamento <=', $dataFim)
            ->groupStart()
            ->where('status_pagamento', 'pago')
            ->orWhere('status_pagamento', 'success')
            ->groupEnd()
            ->first();
        $totalPagamentos = $pagamentos['total_valor'] ?? 0;

        // Total de vendas
        $vendas = $this->vendaModel
            ->select('SUM(total) AS total')
            ->where('data_venda >=', $dataInicio)
            ->where('data_venda <=', $dataFim)
            ->first();
        $totalVendas = $vendas['total'] ?? 0;

        // Total de despesas
        $despesas = $this->despesaModel
            ->select('SUM(valor) as valor')
            ->where('data >=', $dataInicio)
            ->where('data <=', $dataFim)
            ->first();
        $totalDespesas = $despesas['valor'] ?? 0;

        $lucro = floatval($totalPagamentos) + floatval($totalVendas) - floatval($totalDespesas);

        $totalClientes = $this->clientemodel->where('status', 'ativo')->countAllResults();
        $pagamentosPendentes = $this->pagamentoModel->where('status_pagamento', 'pendente')->countAllResults();

        return $this->response->setJSON([
            'total_pagamentos' => floatval($totalPagamentos),
            'total_vendas' => floatval($totalVendas),
            'total_despesas' => floatval($totalDespesas),
            'lucro_liquido' => $lucro,
            'total_clientes_ativos' => $totalClientes,
            'pagamentos_pendentes' => $pagamentosPendentes,
            'periodo' => [
                'data_inicio' => $dataInicio,
                'data_fim' => $dataFim,
            ]
        ]);
    }

    public function listaPagamentos()
    {

        $mes = $this->request->getGet('mes');
        $ano = $this->request->getGet('ano');

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

    // public function exportarExcel()
    // {
    //     $json = file_get_contents('php://input');
    //     $dados = json_decode($json, true);


    //     return $this->response->setJSON([
    //         'status' => 'success',
    //         'message' => 'Dados preparados para exportação',
    //         'dados' => $dados
    //     ]);
    // }

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

    public function vendasLojaDetalhadoPdf()
    {
        $mes = $this->request->getGet('mes');
        $ano = $this->request->getGet('ano');

        $lojaVendaItensModel = new LojaItensModel();


        $queryVendas = $this->vendaModel->orderBy('data_venda', 'DESC');

        $periodoDesc = "Todas as Vendas";
        if ($mes && $ano) {
            $queryVendas->like('data_venda', "$ano-$mes-", 'after'); // Formato YYYY-MM-DD

            // Obter o nome do mês com IntlDateFormatter
            $dateObj = \DateTime::createFromFormat('!m', $mes);
            $formatter = new \IntlDateFormatter(
                'pt_BR',
                \IntlDateFormatter::NONE,
                \IntlDateFormatter::NONE,
                'America/Sao_Paulo',
                \IntlDateFormatter::GREGORIAN,
                "LLLL" // Nome do mês por extenso com locale
            );
            $nomeMes = $formatter->format($dateObj);

            $periodoDesc = ucfirst($nomeMes) . " de $ano";
        } elseif ($ano) {
            $queryVendas->like('data_venda', "$ano-", 'after');
            $periodoDesc = "Ano de $ano";
        }

        $vendas = $queryVendas->findAll();
        $vendasComItens = [];
        $totalGeralVendas = 0;

        foreach ($vendas as $venda) {
            $itens = $lojaVendaItensModel
                ->select('
                loja_vendas_itens.quantidade,
                loja_vendas_itens.valor_unitario,
                loja_produtos.nome as produto_nome
            ')
                ->join('loja_produtos', 'loja_produtos.id = loja_vendas_itens.produto_id', 'left')
                ->where('loja_vendas_itens.venda_id', $venda['id'])
                ->findAll();

            $venda['itens'] = $itens;
            $vendasComItens[] = $venda;
            $totalGeralVendas += (float)$venda['total'];
        }

        // Buscar dados da academia
        $academiaInfo = $this->academiaModel->first() ?? [
            'nome' => 'Nome da Academia Padrão',
            'cnpj' => '00.000.000/0000-00',
            'email' => 'contato@academia.com',
            'logo' => 'assets/img/logo_padrao.png',
            'telefone' => '(00) 00000-0000'
        ];

        // Preparar dados para a view
        $dataView = [
            'report_title' => 'Relatório Detalhado de Vendas da Loja',
            'data_geracao' => date('d/m/Y H:i:s'),
            'academia_info' => $academiaInfo,
            'vendas_data' => $vendasComItens,
            'periodo_analise_label' => 'Período de Análise',
            'periodo_analise_valor' => $periodoDesc,
            'total_geral_vendas' => $totalGeralVendas,
        ];

        $html = view('Relatorios/relatorio_vendas_detalhado', $dataView);

        $cssPath = FCPATH . 'assets/css/relatorio_vendas_detalhado.css';
        $css = '';
        if (file_exists($cssPath)) {
            $css = file_get_contents($cssPath);
        } else {
            log_message('error', 'Arquivo CSS do relatório não encontrado: ' . $cssPath);
        }

        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $options->set('isHtml5ParserEnabled', true);
        $options->set('defaultFont', 'Arial');
        $options->set('chroot', FCPATH . 'public');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml('<meta charset="UTF-8"><style>' . $css . '</style>' . $html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $nomeArquivo = 'relatorio-vendas-loja-detalhado-' . date('Ymd-His') . '.pdf';
        return $this->response
            ->setHeader('Content-Type', 'application/pdf')
            ->setHeader('Content-Disposition', 'inline; filename="' . $nomeArquivo . '"')
            ->setBody($dompdf->output());
    }

    public function relatorioPagamentosStatus()
    {

        // 1. Obter o período do request (data de início e fim)
        $dataInicio = $this->request->getGet('data_inicio');
        $dataFim = $this->request->getGet('data_fim');

        // Validação básica das datas
        if (empty($dataInicio) || empty($dataFim)) {
            // Define um período padrão (mês atual) se não for fornecido
            $dataInicio = date('Y-m-01');
            $dataFim = date('Y-m-t');
        }

        // 2. Instanciar os Models
        $pagamentoModel = new PagamentosModel();
        $academiaModel = new AcademiaModel();

        // 3. Buscar os dados da academia para o cabeçalho
        $academia = $academiaModel->first();
        if (!$academia) {
            die('Erro: Dados da academia não foram encontrados.');
        }

        $logoPath = FCPATH . $academia['logo'];

        // 4. Buscar os pagamentos no período, separando por status
        $baseQuery = $pagamentoModel
            ->select('pagamentos.id, pagamentos.valor, pagamentos.data_pagamento, pagamentos.status_pagamento, cliente.nome as cliente_nome')
            ->join('clientes_planos', 'pagamentos.cliente_planos_id = clientes_planos.id', 'left')
            ->join('cliente', 'clientes_planos.cliente_id = cliente.id', 'left')
            ->where('pagamentos.data_pagamento >=', $dataInicio)
            ->where('pagamentos.data_pagamento <=', $dataFim)
            ->orderBy('pagamentos.data_pagamento', 'ASC');

        // Clona a query base para cada status
        $queryPagos = clone $baseQuery;
        $queryPendentes = clone $baseQuery;

        $pagamentosPagos = $queryPagos
            ->groupStart()
            ->where('pagamentos.status_pagamento', 'pago')
            ->orWhere('pagamentos.status_pagamento', 'success')
            ->groupEnd()
            ->findAll();

        $pagamentosPendentes = $queryPendentes
            ->where('pagamentos.status_pagamento', 'pendente')
            ->findAll();

        // 5. Preparar os dados para a View
        $dadosView = [
            'pagamentos_pagos' => $pagamentosPagos,
            'pagamentos_pendentes' => $pagamentosPendentes,
            'periodo_inicio' => date('d/m/Y', strtotime($dataInicio)),
            'periodo_fim' => date('d/m/Y', strtotime($dataFim)),
            'gerado_em' => date('d/m/Y H:i:s'),
            'nome_academia' => $academia['nome'],
            'cnpj_academia' => $academia['cnpj'],
            'email_academia' => $academia['email'],
            'logo_path' => $logoPath,
            'telefone_academia' => $academia['telefone'],
        ];

        // 6. Renderizar o PDF
        $html = view('Relatorios/relatorio_pagamentos_status', $dadosView);

        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $options->set('isHtml5ParserEnabled', true);
        $options->set('defaultFont', 'Arial');
        $options->set('chroot', FCPATH . 'public');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $nomeArquivo = 'relatorio-Pagamentos-' . date('Ymd-His') . '.pdf';
        return $this->response
            ->setHeader('Content-Type', 'application/pdf')
            ->setHeader('Content-Disposition', 'inline; filename="' . $nomeArquivo . '"')
            ->setBody($dompdf->output());
    }
}
