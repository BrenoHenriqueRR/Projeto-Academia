<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <title>Relatório de Pagamentos</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            margin: 15mm;
            size: A4;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            line-height: 1.3;
        }

        .pdf-content {
            width: 100%;
            max-width: 90%;
            margin: 0 auto;
        }

        .header-empresa {
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 25px;
            overflow: hidden;
            width: 100%;
        }

        .logo-empresa {
            width: 60px;
            height: 60px;
            float: left;
            margin-right: 15px;
        }

        .empresa-info {
            float: left;
            width: 55%;
        }

        .empresa-info h3 {
            margin-bottom: 5px;
            font-size: 16px;
        }

        .empresa-info p {
            margin: 2px 0;
            color: #666;
            font-size: 10px;
        }

        .relatorio-titulo {
            float: right;
            text-align: right;
            width: 30%;
        }

        .relatorio-titulo h2 {
            color: #007bff;
            font-size: 14px;
            margin-bottom: 0;
        }

        .relatorio-titulo h4 {
            color: #666;
            font-size: 12px;
        }

        .periodo-info {
            background: #f8f9fa;
            border-left: 4px solid #007bff;
            padding: 12px;
            margin: 15px 0;
            overflow: hidden;
        }

        .periodo-left {
            float: left;
            width: 48%;
        }

        .periodo-right {
            float: right;
            width: 48%;
            text-align: right;
        }

        .secao-tabela {
            margin: 25px 0;
            page-break-inside: avoid;
            width: 100%;
        }

        .secao-titulo {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }

        .tabela-pdf {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
            margin-bottom: 10px;
            table-layout: fixed;
        }

        .tabela-pdf th {
            background: #f8f9fa;
            font-weight: 600;
            padding: 6px 4px;
            border: 1px solid #dee2e6;
            text-align: left;
        }

        .tabela-pdf td {
            padding: 5px 4px;
            border: 1px solid #dee2e6;
            vertical-align: top;
            word-wrap: break-word;
        }

        .tabela-pdf tbody tr:nth-child(even) {
            background: #fafafa;
        }

        .tabela-pdf tfoot td {
            background: #f0f0f0;
            font-weight: bold;
        }

        .text-right {
            text-align: right;
        }

        .status-badge {
            display: inline-block;
            padding: 3px 6px;
            border-radius: 8px;
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
            color: white;
        }

        .status-pago {
            background-color: #28a745;
        }

        .status-pendente {
            background-color: #ffc107;
            color: #333;
        }

        .rodape-relatorio {
            margin-top: 25px;
            padding-top: 12px;
            border-top: 1px solid #dee2e6;
            font-size: 9px;
            color: #666;
            position: fixed;
            bottom: -30px;
            left: 0;
            right: 0;
            width: 100%;
        }

        .rodape-left {
            float: left;
            width: 48%;
        }

        .rodape-right {
            float: right;
            width: 48%;
            text-align: right;
        }

        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }

        .no-data {
            text-align: center;
            padding: 20px;
            color: #888;
        }
    </style>
</head>

<body>
    <div class="pdf-content">
        <!-- Cabeçalho -->
        <header class="header-empresa clearfix">
            <div class="logo-empresa">
                <img src="<?= htmlspecialchars($logo_path) ?>" alt="Logo" style="max-width: 100%;">
            </div>
            <div class="empresa-info">
                <h3><?= htmlspecialchars($nome_academia) ?></h3>
                <p>CNPJ: <?= htmlspecialchars($cnpj_academia) ?></p>
                <p><?= htmlspecialchars($email_academia) ?> | <?= htmlspecialchars($telefone_academia) ?></p>
            </div>
            <div class="relatorio-titulo">
                <h2>RELATÓRIO DE PAGAMENTOS</h2>
                <h4>POR STATUS</h4>
            </div>
        </header>

        <!-- Período -->
        <div class="periodo-info clearfix">
            <div class="periodo-left">
                <strong>Período de Análise:</strong><br>
                <?= $periodo_inicio ?> a <?= $periodo_fim ?>
            </div>
            <div class="periodo-right">
                <strong>Data de Geração:</strong><br>
                <?= $gerado_em ?>
            </div>
        </div>

        <!-- Tabela de Pagamentos Pagos -->
        <main>
            <section class="secao-tabela">
                <div class="secao-titulo">PAGAMENTOS CONFIRMADOS</div>
                <?php if (!empty($pagamentos_pagos)): ?>
                    <?php $totalPagos = 0; ?>
                    <table class="tabela-pdf">
                        <thead>
                            <tr>
                                <th width="45%">Cliente</th>
                                <th width="20%">Data Pagamento</th>
                                <th width="20%" class="text-right">Valor</th>
                                <th width="15%">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($pagamentos_pagos as $p): ?>
                                <?php
                                $valorLimpo = floatval(str_replace(['R$', '.', ','], ['', '', '.'], $p['valor']));
                                $totalPagos += $valorLimpo;
                                ?>
                                <tr>
                                    <td><?= htmlspecialchars($p['cliente_nome'] ?? 'Cliente não encontrado') ?></td>
                                    <td><?= date('d/m/Y', strtotime($p['data_pagamento'])) ?></td>
                                    <td class="text-right">R$ <?= number_format($valorLimpo, 2, ',', '.') ?></td>
                                    <td><span class="status-badge status-pago">PAGO</span></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2"><strong>Total (<?= count($pagamentos_pagos) ?>)</strong></td>
                                <td class="text-right"><strong>R$ <?= number_format($totalPagos, 2, ',', '.') ?></strong></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                <?php else: ?>
                    <p class="no-data">Nenhum pagamento confirmado encontrado no período.</p>
                <?php endif; ?>
            </section>

            <!-- Tabela de Pagamentos Pendentes -->
            <section class="secao-tabela">
                <div class="secao-titulo">PAGAMENTOS PENDENTES</div>
                <?php if (!empty($pagamentos_pendentes)): ?>
                    <?php $totalPendentes = 0; ?>
                    <table class="tabela-pdf">
                        <thead>
                            <tr>
                                <th width="45%">Cliente</th>
                                <th width="20%">Data Vencimento</th>
                                <th width="20%" class="text-right">Valor</th>
                                <th width="15%">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($pagamentos_pendentes as $p): ?>
                                <?php
                                $valorLimpo = floatval(str_replace(['R$', '.', ','], ['', '', '.'], $p['valor']));
                                $totalPendentes += $valorLimpo;
                                ?>
                                <tr>
                                    <td><?= htmlspecialchars($p['cliente_nome'] ?? 'Cliente não encontrado') ?></td>
                                    <td><?= date('d/m/Y', strtotime($p['data_pagamento'])) ?></td>
                                    <td class="text-right">R$ <?= number_format($valorLimpo, 2, ',', '.') ?></td>
                                    <td><span class="status-badge status-pendente">PENDENTE</span></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2"><strong>Total (<?= count($pagamentos_pendentes) ?>)</strong></td>
                                <td class="text-right"><strong>R$ <?= number_format($totalPendentes, 2, ',', '.') ?></strong></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                <?php else: ?>
                    <p class="no-data">Nenhum pagamento pendente encontrado no período.</p>
                <?php endif; ?>
            </section>
        </main>

        <!-- Rodapé -->
        <footer class="rodape-relatorio clearfix">
            <div class="rodape-left">
                <strong>Sistema de Gestão Financeira</strong>
            </div>
            <div class="rodape-right">
                Página <script type="text/php">echo $PAGE_NUM . " de " . $PAGE_COUNT;</script>
            </div>
        </footer>
    </div>
</body>

</html>