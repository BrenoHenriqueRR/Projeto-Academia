<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= esc($report_title ?? 'Relatório de Vendas'); ?></title>
</head>
<body>
    <div class="pdf-content">
        <div class="header-empresa clearfix">
            <div class="logo-empresa">
                <?php
                $logoPath = $academia_info['logo'] ?? '';
                if ($logoPath && file_exists(ROOTPATH . 'public/' . ltrim($logoPath, '/'))) {
                    echo '<img src="' . ROOTPATH . 'public/' . esc(ltrim($logoPath,'/'), 'attr') . '" alt="Logo">';
                } elseif ($logoPath) { // Tenta como URL completa se não encontrar localmente (requer isRemoteEnabled)
                     echo '<img src="' . esc($logoPath, 'attr') . '" alt="Logo">';
                }
                ?>
            </div>
            <div class="empresa-info">
                <h3><?= esc($academia_info['nome'] ?? 'Nome da Academia'); ?></h3>
                <p>CNPJ: <?= esc($academia_info['cnpj'] ?? 'N/D'); ?></p>
                <p><?= esc($academia_info['email'] ?? 'N/D'); ?> | <?= esc($academia_info['telefone'] ?? 'N/D'); ?></p>
            </div>
            <div class="relatorio-titulo">
                <h2>RELATÓRIO</h2>
                <h4>VENDAS DA LOJA (DETALHADO)</h4>
            </div>
        </div>

        <div class="periodo-info clearfix">
            <div class="periodo-left">
                <?php if (isset($periodo_analise_label) && isset($periodo_analise_valor)) : ?>
                    <strong><?= esc($periodo_analise_label); ?>:</strong><br>
                    <?= esc($periodo_analise_valor); ?>
                <?php endif; ?>
            </div>
            <div class="periodo-right">
                <strong>Data de Geração:</strong><br>
                <?= esc($data_geracao ?? date('d/m/Y H:i:s')); ?>
            </div>
        </div>
        
        <?php if (!empty($vendas_data)) : ?>
            <?php foreach ($vendas_data as $venda) : ?>
                <div class="secao-tabela no-break" style="margin-bottom: 15px; border: 1px solid #eee; padding:10px; border-radius: 5px;">
                    <div class="secao-titulo" style="font-size: 12px; margin-bottom: 8px; border-bottom: none;">
                        Venda ID: #<?= esc($venda['id']); ?> - 
                        Data: <?= esc(date('d/m/Y H:i', strtotime($venda['data_venda']))); ?> - 
                        Total: R$ <?= esc(number_format($venda['total'], 2, ',', '.')); ?> -
                        Pagamento: <?= esc(ucfirst($venda['forma_pagamento'])); ?>
                    </div>
                    <?php if (!empty($venda['itens'])) : ?>
                        <table class="tabela-pdf" style="font-size: 8px; margin-bottom: 5px;">
                            <thead style="background-color: #f9f9f9;">
                                <tr>
                                    <th style="width: 50%;">Produto</th>
                                    <th style="width: 15%; text-align:center;">Qtd.</th>
                                    <th style="width: 20%; text-align:right;">Preço Unit.</th>
                                    <th style="width: 15%; text-align:right;">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($venda['itens'] as $item) : ?>
                                    <?php $subtotalItem = (float)$item['quantidade'] * (float)$item['valor_unitario']; ?>
                                    <tr>
                                        <td><?= esc($item['produto_nome']); ?></td>
                                        <td style="text-align:center;"><?= esc($item['quantidade']); ?></td>
                                        <td style="text-align:right;">R$ <?= esc(number_format($item['valor_unitario'], 2, ',', '.')); ?></td>
                                        <td style="text-align:right;">R$ <?= esc(number_format($subtotalItem, 2, ',', '.')); ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php else : ?>
                        <p style="font-size: 9px; margin-left: 5px;">Nenhum item encontrado para esta venda.</p>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>

            <div class="periodo-info clearfix" style="margin-top: 20px; background: #e9ecef; border-left-color: #17a2b8;">
                 <div class="periodo-left" style="width: auto;">
                    <strong>Total de Vendas no Período:</strong>
                </div>
                <div class="periodo-right" style="width: auto; font-size: 12px; font-weight: bold;">
                    R$ <?= esc(number_format($total_geral_vendas, 2, ',', '.')); ?>
                </div>
            </div>

        <?php else : ?>
            <div class="secao-tabela">
                 <p>Nenhuma venda encontrada para o período selecionado.</p>
            </div>
        <?php endif; ?>


        <div class="observacoes no-break" style="margin-top:30px;">
            <div class="secao-titulo">Observações</div>
            <div class="observacoes-conteudo">
                <ul>
                    <li>Este relatório detalha todas as vendas da loja e seus respectivos itens para o período especificado.</li>
                    <li>Valores expressos em Reais (BRL).</li>
                </ul>
            </div>
        </div>

        <div class="assinatura-box no-break">
            <div class="assinatura-linha">
                <div></div>
                <strong>Responsável pelas Vendas / Gerência</strong><br>
                <small style="color: #666;">Sistema de Gestão da Academia</small>
            </div>
        </div>

        <div class="rodape-relatorio clearfix">
            <div class="rodape-left">
                <strong><?= esc($academia_info['nome'] ?? 'Sistema de Gestão'); ?></strong><br>
                Relatório gerado em <?= esc($data_geracao ?? date('d/m/Y H:i:s')); ?>
            </div>
            <div class="rodape-right">
                <strong>Página <span class="page-number"></span> de <span class="total-pages"></span></strong><br>
                Confidencial - Uso Interno
            </div>
        </div>
    </div>
    
    <script type="text/php">
        if (isset($pdf)) {
            $text = "Página {PAGE_NUM} de {PAGE_COUNT}";
            $size = 8;
            $font = $fontMetrics->getFont("Arial", "normal");
            $width = $fontMetrics->getTextWidth($text, $font, $size); // Largura total do texto
            $x = $pdf->get_width() - $width - $pdf->get_option('margin_right') + 45; // Ajustar para alinhar à direita dentro da margem
            $y = $pdf->get_height() - 35;
            // $pdf->page_text($x, $y, $text, $font, $size); // Descomentado para teste

            // Atualiza os spans no rodapé (solução alternativa)
             $dom = $pdf->getDom();
             $page_elements = $dom->getElementsByTagName('span');
             foreach ($page_elements as $element) {
                 if ($element->getAttribute('class') === 'page-number') {
                     $element->nodeValue = $pdf->get_page_number();
                 }
                 if ($element->getAttribute('class') === 'total-pages') {
                     $element->nodeValue = $pdf->get_page_count();
                 }
             }
        }
    </script>
</body>
</html>