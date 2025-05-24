<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Financeiro - <?= $nome_mes ?>/<?= $ano ?></title>
</head>
<body>
    <div class="pdf-content">
        <!-- Cabeçalho -->
        <div class="header-empresa clearfix">
            <div class="logo-empresa">
                SYS
            </div>
            <div class="empresa-info">
                <h3>Nome da Sua Empresa</h3>
                <p>CNPJ: 00.000.000/0001-00</p>
                <p>endereco@empresa.com | (11) 9999-9999</p>
            </div>
            <div class="relatorio-titulo">
                <h2>RELATÓRIO</h2>
                <h4>FINANCEIRO</h4>
            </div>
        </div>

        <!-- Período -->
        <div class="periodo-info clearfix">
            <div class="periodo-left">
                <strong>Período de Análise:</strong><br>
                <?= $nome_mes ?> de <?= $ano ?>
            </div>
            <div class="periodo-right">
                <strong>Data de Geração:</strong><br>
                <?= $gerado_em ?>
            </div>
        </div>

        <!-- Resumo Executivo -->
        <div class="no-break">
            <h5 style="margin-bottom: 15px; font-size: 14px;">📈 Resumo Executivo</h5>
            <div class="resumo-cards clearfix">
                <div class="card-resumo">
                    <div class="label">RECEITAS TOTAIS</div>
                    <div class="valor valor-positivo">
                        R$ <?= number_format($resumo['total_pagamentos'] + $resumo['total_vendas'], 2, ',', '.') ?>
                    </div>
                </div>
                <div class="card-resumo">
                    <div class="label">PAGAMENTOS</div>
                    <div class="valor valor-positivo">
                        R$ <?= number_format($resumo['total_pagamentos'], 2, ',', '.') ?>
                    </div>
                </div>
                <div class="card-resumo">
                    <div class="label">VENDAS</div>
                    <div class="valor valor-positivo">
                        R$ <?= number_format($resumo['total_vendas'], 2, ',', '.') ?>
                    </div>
                </div>
                <div class="card-resumo">
                    <div class="label">DESPESAS</div>
                    <div class="valor valor-negativo">
                        R$ <?= number_format($resumo['total_despesas'], 2, ',', '.') ?>
                    </div>
                </div>
            </div>
            <div class="resumo-cards clearfix" style="margin-top: 10px;">
                <div class="card-resumo" style="width: 48%; margin-right: 4%;">
                    <div class="label">LUCRO LÍQUIDO</div>
                    <div class="valor valor-neutro">
                        R$ <?= number_format($resumo['lucro_liquido'], 2, ',', '.') ?>
                    </div>
                </div>
                <div class="card-resumo" style="width: 48%; margin-right: 0;">
                    <div class="label">MARGEM DE LUCRO</div>
                    <div class="valor valor-neutro">
                        <?php 
                        $receita_total = $resumo['total_pagamentos'] + $resumo['total_vendas'];
                        $margem = $receita_total > 0 ? ($resumo['lucro_liquido'] / $receita_total * 100) : 0;
                        echo number_format($margem, 1, ',', '.') . '%';
                        ?>
                    </div>
                </div>
            </div>
        </div>

        <!-- Análise Detalhada -->
        <div class="analise-detalhada clearfix no-break">
            <h5 style="margin-bottom: 15px; font-size: 14px;">📊 Análise Detalhada</h5>
            <div class="analise-col">
                <strong>Composição da Receita:</strong>
                <ul>
                    <li>Pagamentos de Clientes: 
                        <span class="valor-positivo">
                            <?php 
                            $receita_total = $resumo['total_pagamentos'] + $resumo['total_vendas'];
                            $perc_pag = $receita_total > 0 ? ($resumo['total_pagamentos'] / $receita_total * 100) : 0;
                            echo number_format($perc_pag, 1, ',', '.') . '%';
                            ?>
                        </span>
                    </li>
                    <li>Vendas da Loja: 
                        <span class="valor-positivo">
                            <?php 
                            $perc_ven = $receita_total > 0 ? ($resumo['total_vendas'] / $receita_total * 100) : 0;
                            echo number_format($perc_ven, 1, ',', '.') . '%';
                            ?>
                        </span>
                    </li>
                </ul>
            </div>
            <div class="analise-col">
                <strong>Indicadores:</strong>
                <ul>
                    <li>Total de Transações: 
                        <span class="valor-neutro"><?= count($pagamentos) + count($vendas) ?></span>
                    </li>
                    <li>Ticket Médio Vendas: 
                        <span class="valor-neutro">
                            <?php 
                            $ticket_medio = count($vendas) > 0 ? ($resumo['total_vendas'] / count($vendas)) : 0;
                            echo 'R$ ' . number_format($ticket_medio, 2, ',', '.');
                            ?>
                        </span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Tabela de Pagamentos -->
        <?php if (!empty($pagamentos)): ?>
        <div class="secao-tabela">
            <div class="secao-titulo">💳 Pagamentos do Período</div>
            <table class="tabela-pdf">
                <thead>
                    <tr>
                        <th width="30%">Cliente</th>
                        <th width="20%">Valor</th>
                        <th width="20%">Data Pagamento</th>
                        <th width="15%">Status</th>
                        <th width="15%">Funcionário</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($pagamentos as $p): ?>
                    <tr>
                        <td><?= htmlspecialchars($p['nome']) ?></td>
                        <td>R$ <?= number_format(floatval(str_replace(['R$', ',', '.'], ['', '.', ''], $p['valor'])), 2, ',', '.') ?></td>
                        <td><?= date('d/m/Y', strtotime($p['data_pagamento'])) ?></td>
                        <td>
                            <?php 
                            $status_class = 'status-' . strtolower($p['status_pagamento']);
                            if (strtolower($p['status_pagamento']) == 'pago') $status_class = 'status-pago';
                            elseif (strtolower($p['status_pagamento']) == 'pendente') $status_class = 'status-pendente';
                            else $status_class = 'status-cancelado';
                            ?>
                            <span class="status-badge <?= $status_class ?>"><?= strtoupper($p['status_pagamento']) ?></span>
                        </td>
                        <td><?= isset($p['funcionario']) ? htmlspecialchars($p['funcionario']) : '-' ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php endif; ?>

        <!-- Tabela de Vendas -->
        <?php if (!empty($vendas)): ?>
        <div class="secao-tabela">
            <div class="secao-titulo">🛍️ Vendas do Período</div>
            <table class="tabela-pdf">
                <thead>
                    <tr>
                        <th width="15%">ID Venda</th>
                        <th width="25%">Data</th>
                        <th width="20%">Valor Total</th>
                        <th width="40%">Observações</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($vendas as $v): ?>
                    <tr>
                        <td>#<?= $v['id'] ?></td>
                        <td><?= date('d/m/Y', strtotime($v['data_venda'])) ?></td>
                        <td>R$ <?= number_format($v['total'], 2, ',', '.') ?></td>
                        <td><?= isset($v['observacoes']) ? htmlspecialchars($v['observacoes']) : 'Venda realizada' ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php endif; ?>

        <!-- Tabela de Despesas -->
        <?php if (!empty($despesas)): ?>
        <div class="secao-tabela">
            <div class="secao-titulo">💸 Despesas do Período</div>
            <table class="tabela-pdf">
                <thead>
                    <tr>
                        <th width="40%">Descrição</th>
                        <th width="20%">Valor</th>
                        <th width="20%">Data</th>
                        <th width="20%">Categoria</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($despesas as $d): ?>
                    <tr>
                        <td><?= htmlspecialchars($d['descricao']) ?></td>
                        <td>R$ <?= number_format($d['valor'], 2, ',', '.') ?></td>
                        <td><?= date('d/m/Y', strtotime($d['data'])) ?></td>
                        <td><?= isset($d['categoria']) ? htmlspecialchars($d['categoria']) : 'Geral' ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php endif; ?>

        <!-- Observações -->
        <div class="observacoes no-break">
            <div class="secao-titulo">📝 Observações e Recomendações</div>
            <div class="observacoes-conteudo">
                <ul>
                    <li>Relatório gerado automaticamente pelo sistema de gestão financeira.</li>
                    <li>Total de <?= count($pagamentos) ?> pagamento(s) e <?= count($vendas) ?> venda(s) registrados no período.</li>
                    <li>Margem de lucro de <?= number_format($margem, 1, ',', '.') ?>% considerada 
                        <?= $margem >= 20 ? '<strong class="valor-positivo">excelente</strong>' : ($margem >= 10 ? '<strong class="valor-neutro">boa</strong>' : '<strong class="valor-negativo">baixa</strong>') ?> 
                        para o período.
                    </li>
                    <?php if ($resumo['total_despesas'] > ($resumo['total_pagamentos'] + $resumo['total_vendas']) * 0.3): ?>
                    <li><strong class="valor-negativo">Atenção:</strong> Despesas representam mais de 30% da receita bruta.</li>
                    <?php endif; ?>
                </ul>
            </div>
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