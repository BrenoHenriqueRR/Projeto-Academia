<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <title>Relatório Financeiro - Clientes</title>
    <style>
        @page {
            margin: 15mm;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            line-height: 1.4;
        }

        .pdf-content {
            width: 90%;
            margin: 0 auto;
        }

        .header-empresa {
            border-bottom: 3px solid #007bff;
            margin-bottom: 25px;
        }

        .empresa-info {
            float: left;
            width: 60%;
        }


        .tabela-pdf {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .tabela-pdf th,
        .tabela-pdf td {
            border: 1px solid #ccc;
            padding: 5px;
        }

        .tabela-pdf th {
            background: #f8f9fa;
        }

        .cliente-nome {
            background: #e9ecef;
            font-weight: bold;
            padding: 8px;
        }

        .total-geral {
            text-align: right;
            font-weight: bold;
            margin-top: 15px;
            border-top: 2px solid #007bff;
            padding-top: 5px;
        }
    </style>
</head>

<body>
    <div class="pdf-content">
        <div class="header-empresa clearfix">
            <div class="empresa-info">
                <h3><?= htmlspecialchars($nome_academia) ?></h3>
                <p><?= htmlspecialchars($email_academia) ?> | <?= htmlspecialchars($telefone_academia) ?></p>
            </div>
            <div class="relatorio-titulo">
                <h2>RELATÓRIO PAGAMENTOS</h2>
                <h4>Clientes da Academia</h4>
            </div>
        </div>

        <?php if (!empty($clientes)): ?>
            <?php foreach ($clientes as $cli): ?>
                <div class="cliente-nome"><?= htmlspecialchars($cli['nome']) ?> (<?= htmlspecialchars($cli['email']) ?>)</div>
                <table class="tabela-pdf">
                    <thead>
                        <tr>
                            <th>Plano</th>
                            <th>Valor (R$)</th>
                            <th>Forma Pagamento</th>
                            <th>Status</th>
                            <th>Data Pagamento</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $total = 0;
                        foreach ($cli['pagamentos'] as $pg): $total += $pg['valor_pago']; ?>
                            <tr>
                                <td><?= htmlspecialchars($pg['plano_nome']) ?></td>
                                <td><?= number_format($pg['valor_pago'], 2, ',', '.') ?></td>
                                <td><?= ucfirst($pg['forma_pagamento']) ?></td>
                                <td><?= ucfirst($pg['status_pagamento']) ?></td>
                                <td><?= date('d/m/Y', strtotime($pg['data_pagamento'])) ?></td>
                            </tr>
                        <?php endforeach; ?>
                        <tr>
                            <td colspan="5" style="text-align:right;font-weight:bold;">Subtotal: R$ <?= number_format($total, 2, ',', '.') ?></td>
                        </tr>
                    </tbody>
                </table>
            <?php endforeach; ?>
        <?php else: ?>
            <p style="text-align:center;color:#777;">Nenhum pagamento encontrado nesse período.</p>
        <?php endif; ?>

        <div class="total-geral">
            Total geral recebido: <strong>R$ <?= number_format($total_geral, 2, ',', '.') ?></strong>
        </div>

        <p style="text-align:right;margin-top:10px;">Gerado em <?= $gerado_em ?></p>
    </div>
</body>

</html>