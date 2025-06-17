<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Clientes por Status</title>
    <style>
        /* --- Início do CSS do seu template --- */
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
            margin: 0;
            padding: 0;
            font-size: 10px;
            line-height: 1.3;
            max-width: 100%;
            overflow-x: hidden;
        }

        .pdf-content {
            width: 100%;
            max-width: 90%;
            margin: 0 auto;
            background: white;
            overflow: hidden;
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
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            font-weight: bold;
            float: left;
            margin-right: 15px;
        }

        .empresa-info {
            float: left;
            width: 55%;
            overflow: hidden;
            word-wrap: break-word;
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
            overflow: hidden;
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

        .secao-tabela {
            margin: 20px 0;
            page-break-inside: avoid;
            width: 100%;
            overflow: hidden;
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
            margin-bottom: 15px;
            table-layout: fixed;
        }

        .tabela-pdf th {
            background: #f8f9fa;
            font-weight: 600;
            padding: 6px 4px;
            border: 1px solid #dee2e6;
            text-align: left;
            font-size: 9px;
            word-wrap: break-word;
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

        .status-badge {
            display: inline-block;
            padding: 3px 6px;
            border-radius: 8px;
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .status-ativo {
            background: #d4edda;
            color: #155724;
        }

        .status-inativo {
            background: #fff3cd;
            color: #856404;
        }

        .status-anulado {
            background: #f8d7da;
            color: #721c24;
        }


        .assinatura-box {
            border: 1px solid #dee2e6;
            height: 60px;
            /* Reduzido de 70px */
            margin: 20px 0;
            /* Reduzido de 25px */
            padding: 10px;
            text-align: center;
            position: relative;
            width: 100%;
        }

        .assinatura-linha {
            position: absolute;
            bottom: 12px;
            /* Reduzido de 15px */
            left: 50%;
            transform: translateX(-50%);
        }

        .assinatura-linha div {
            border-top: 1px solid #666;
            width: 200px;
            /* Reduzido de 250px */
            margin-bottom: 3px;
        }

        .rodape-relatorio {
            margin-top: 25px;
            /* Reduzido de 30px */
            padding-top: 12px;
            /* Reduzido de 15px */
            border-top: 1px solid #dee2e6;
            font-size: 9px;
            /* Reduzido de 10px */
            color: #666;
            overflow: hidden;
            width: 100%;
        }

        .rodape-left {
            float: left;
            width: 48%;
            /* Reduzido de 50% */
        }

        .rodape-right {
            float: right;
            width: 48%;
            /* Reduzido de 50% */
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

        /* --- Fim do CSS --- */
    </style>
</head>

<body>
    <div class="pdf-content">
        <div class="header-empresa clearfix">
            <div class="logo-empresa">
                <img src="<?= 'http://localhost/sites/Projeto1/Back-end/public/' . $logo_academia ?>" alt="Logo" style="max-width: 100%; max-height: 100%;">
            </div>
            <div class="empresa-info">
                <h3><?= htmlspecialchars($nome_academia) ?></h3>
                <p>CNPJ: <?= htmlspecialchars($cnpj_academia) ?></p>
                <p><?= htmlspecialchars($email_academia) ?> | <?= htmlspecialchars($telefone_academia) ?></p>
            </div>
            <div class="relatorio-titulo">
                <h2>RELATÓRIO DE CLIENTES</h2>
                <h4>STATUS DE CADASTRO</h4>
            </div>
        </div>

        <div class="secao-tabela">
            <div class="secao-titulo">CLIENTES ATIVOS (Total: <?= count($clientes_ativos) ?>)</div>
            <?php if (!empty($clientes_ativos)): ?>
                <table class="tabela-pdf">
                    <thead>
                        <tr>
                            <th width="10%">ID</th>
                            <th width="40%">Nome</th>
                            <th width="30%">Email</th>
                            <th width="20%">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($clientes_ativos as $cliente): ?>
                            <tr>
                                <td><?= $cliente['id'] ?></td>
                                <td><?= htmlspecialchars($cliente['nome']) ?></td>
                                <td><?= htmlspecialchars($cliente['email']) ?></td>
                                <td><span class="status-badge status-ativo"><?= htmlspecialchars($cliente['status']) ?></span></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p class="no-data">Nenhum cliente ativo encontrado.</p>
            <?php endif; ?>
        </div>

        <div class="secao-tabela">
            <div class="secao-titulo">CLIENTES INATIVOS (Total: <?= count($clientes_inativos) ?>)</div>
            <?php if (!empty($clientes_inativos)): ?>
                <table class="tabela-pdf">
                    <thead>
                        <tr>
                            <th width="10%">ID</th>
                            <th width="40%">Nome</th>
                            <th width="30%">Email</th>
                            <th width="20%">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($clientes_inativos as $cliente): ?>
                            <tr>
                                <td><?= $cliente['id'] ?></td>
                                <td><?= htmlspecialchars($cliente['nome']) ?></td>
                                <td><?= htmlspecialchars($cliente['email']) ?></td>
                                <td><span class="status-badge status-inativo"><?= htmlspecialchars($cliente['status']) ?></span></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p class="no-data">Nenhum cliente inativo encontrado.</p>
            <?php endif; ?>
        </div>

        <div class="secao-tabela">
            <div class="secao-titulo">CLIENTES ANULADOS (Total: <?= count($clientes_anulados) ?>)</div>
            <?php if (!empty($clientes_anulados)): ?>
                <table class="tabela-pdf">
                    <thead>
                        <tr>
                            <th width="10%">ID</th>
                            <th width="40%">Nome</th>
                            <th width="30%">Email</th>
                            <th width="20%">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($clientes_anulados as $cliente): ?>
                            <tr>
                                <td><?= $cliente['id'] ?></td>
                                <td><?= htmlspecialchars($cliente['nome']) ?></td>
                                <td><?= htmlspecialchars($cliente['email']) ?></td>
                                <td><span class="status-badge status-anulado"><?= htmlspecialchars($cliente['status']) ?></span></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p class="no-data">Nenhum cliente anulado encontrado.</p>
            <?php endif; ?>
        </div>

        <!-- Assinatura -->
        <div class="assinatura-box">
            <div class="assinatura-linha">
                <div></div>
                <strong>Responsável Financeiro</strong><br>
                <small style="color: #666;">Sistema de Gestão</small>
            </div>
        </div>

        <!-- Rodapé -->
        <div class="rodape-relatorio clearfix">
            <div class="rodape-left">
                <strong>Sistema de Gestão Financeira</strong><br>
                Relatório gerado automaticamente em <?= $gerado_em ?>
            </div>
            <div class="rodape-right">
                <strong>Página 1 de 1</strong><br>
                Confidencial - Uso Interno
            </div>
        </div>
    </div>
</body>

</html>