<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <title>Relatório de Presença - <?= $periodo['inicio'] ?> a <?= $periodo['fim'] ?></title>
  <style>
    body {
      font-family: DejaVu Sans, sans-serif;
      font-size: 12px;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .clearfix::after {
      content: "";
      display: table;
      clear: both;
    }

    .header-empresa {
      border-bottom: 2px solid #000;
      padding: 10px 0;
      margin-bottom: 20px;
    }

    .logo-empresa {
      float: left;
      width: 15%;
    }

    .empresa-info {
      float: left;
      width: 55%;
      padding-left: 10px;
    }

    .relatorio-titulo {
      float: right;
      width: 30%;
      text-align: right;
    }

    .periodo-info {
      margin-bottom: 20px;
    }

    .periodo-left {
      float: left;
      width: 50%;
    }

    .periodo-right {
      float: right;
      width: 50%;
      text-align: right;
    }

    .resumo-cards {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .card-resumo {
      flex: 1;
      background: #f8f8f8;
      padding: 10px;
      border-radius: 5px;
      text-align: center;
      border: 1px solid #ccc;
    }

    .label {
      font-weight: bold;
      font-size: 12px;
    }

    .valor {
      font-size: 14px;
      margin-top: 5px;
    }

    .valor-positivo {
      color: green;
      font-weight: bold;
    }

    .valor-negativo {
      color: red;
      font-weight: bold;
    }

    .valor-neutro {
      color: #333;
      font-weight: bold;
    }

    .secao-tabela {
      margin-top: 25px;
    }

    .secao-titulo {
      font-weight: bold;
      font-size: 14px;
      border-bottom: 2px solid #000;
      margin-bottom: 10px;
    }

    .tabela-pdf {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    .tabela-pdf th,
    .tabela-pdf td {
      border: 1px solid #ccc;
      padding: 6px;
      font-size: 11px;
      text-align: center;
    }

    .status-badge {
      padding: 2px 6px;
      border-radius: 3px;
      color: #fff;
      font-weight: bold;
    }

    .status-sucesso {
      background-color: green;
    }

    .status-erro {
      background-color: red;
    }

    .assinatura-box {
      margin-top: 40px;
      text-align: center;
    }

    .assinatura-linha div {
      border-top: 1px solid #000;
      width: 50%;
      margin: 0 auto 5px;
    }

    .rodape-relatorio {
      font-size: 10px;
      color: #666;
      border-top: 1px solid #ccc;
      padding-top: 10px;
      margin-top: 30px;
    }

    .rodape-left {
      float: left;
    }

    .rodape-right {
      float: right;
      text-align: right;
    }

    ul {
      margin-top: 5px;
    }
  </style>
</head>

<body>
  <div class="pdf-content">
    <!-- Cabeçalho -->
    <div class="header-empresa clearfix">
      <div class="logo-empresa">
        <img src="<?= 'http://localhost/sites/Projeto1/Back-end/public/' . $logo_academia ?>" alt="Logo" style="max-width: 100%;">
      </div>
      <div class="empresa-info">
        <h3><?= $nome_academia ?></h3>
        <p>CNPJ: <?= $cnpj_academia ?></p>
        <p><?= $email_academia ?> | <?= $telefone_academia ?></p>
      </div>
      <div class="relatorio-titulo">
        <h2>RELATÓRIO</h2>
        <h4>PRESENÇA E FREQUÊNCIA</h4>
      </div>
    </div>

    <!-- Período -->
    <div class="periodo-info clearfix">
      <div class="periodo-left">
        <strong>Período de Análise:</strong><br>
        <?= $periodo['inicio'] ?> a <?= $periodo['fim'] ?>
      </div>
      <div class="periodo-right">
        <strong>Data de Geração:</strong><br>
        <?= $gerado_em ?>
      </div>
    </div>

    <!-- Resumo Executivo -->
    <div class="no-break">
      <h5 style="margin-bottom: 15px; font-size: 14px;">Resumo Executivo</h5>
      <div class="resumo-cards clearfix">
        <div class="card-resumo">
          <div class="label">TOTAL DE PRESENÇAS</div>
          <div class="valor valor-neutro"><?= $resumo['total'] ?></div>
        </div>
        <div class="card-resumo">
          <div class="label">TAXA DE SUCESSO</div>
          <div class="valor valor-positivo"><?= $resumo['taxa_sucesso'] ?>%</div>
        </div>
        <div class="card-resumo">
          <div class="label">TAXA DE ERRO</div>
          <div class="valor valor-negativo"><?= $resumo['taxa_erro'] ?>%</div>
        </div>
        <div class="card-resumo">
          <div class="label">MÉTODO FACE ID</div>
          <div class="valor valor-neutro"><?= $resumo['faceid'] ?> (<?= $resumo['total'] > 0 ? round(($resumo['faceid'] / $resumo['total']) * 100, 1) : 0 ?>%)</div>
        </div>
        <div class="card-resumo">
          <div class="label">MÉTODO PIN</div>
          <div class="valor valor-neutro"><?= $resumo['pin'] ?> (<?= $resumo['total'] > 0 ? round(($resumo['pin'] / $resumo['total']) * 100, 1) : 0 ?>%)</div>
        </div>
        <div class="card-resumo">
          <div class="label">CLIENTES ÚNICOS</div>
          <div class="valor valor-neutro"><?= $resumo['clientes_unicos'] ?></div>
        </div>
      </div>
    </div>

    <!-- Análise Detalhada -->
    <div class="analise-detalhada clearfix no-break" style="margin-top: 25px;">
      <h5 style="margin-bottom: 15px; font-size: 14px;">Análise Detalhada</h5>
      <ul>
        <li>Foram registradas <strong><?= $resumo['total'] ?></strong> presenças no período analisado, com uma taxa de sucesso de <strong><?= $resumo['taxa_sucesso'] ?>%</strong>.</li>
        <li>O método <strong>Face ID</strong> foi responsável por <strong><?= $resumo['total'] > 0 ? round(($resumo['faceid'] / $resumo['total']) * 100, 1) : 0 ?>%</strong> das autenticações, sendo o preferido pelos clientes.</li>
        <li>O método <strong>PIN</strong> respondeu por <strong><?= $resumo['total'] > 0 ? round(($resumo['pin'] / $resumo['total']) * 100, 1) : 0 ?>%</strong> das presenças, utilizado como alternativa ao reconhecimento facial.</li>
        <li>Um total de <strong><?= $resumo['clientes_unicos'] ?></strong> clientes distintos acessaram as dependências da academia no período, indicando boa adesão e engajamento da base ativa.</li>
        <?php if ($resumo['taxa_sucesso'] >= 90): ?>
          <li><strong class="valor-positivo">Excelente desempenho</strong> do sistema de autenticação, com poucos casos de falha registrados.</li>
        <?php elseif ($resumo['taxa_sucesso'] >= 75): ?>
          <li><strong class="valor-neutro">Bom desempenho</strong> do sistema, com margem para pequenos ajustes em reconhecimento facial.</li>
        <?php else: ?>
          <li><strong class="valor-negativo">Atenção:</strong> Taxa de sucesso abaixo do esperado. Recomenda-se verificação nas capturas de imagem e atualização do banco facial.</li>
        <?php endif; ?>
      </ul>
    </div>

    <!-- Tabela de Presenças -->
    <?php if (!empty($presencas)): ?>
      <div class="secao-tabela">
        <div class="secao-titulo">Registros de Presença no Período</div>
        <table class="tabela-pdf">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Data</th>
              <th>Método</th>
              <th>Status</th>
              <th>Entrada</th>
              <th>Saída</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($presencas as $p): ?>
              <?php
              $statusClass = strtolower($p['status']) === 'sucesso' ? 'status-sucesso' : 'status-erro';
              $tempo = '-';
              if ($p['hora_entrada'] && $p['hora_saida']) {
                $entrada = new DateTime($p['hora_entrada']);
                $saida = new DateTime($p['hora_saida']);
                $tempo = $entrada->diff($saida)->format('%Hh %Im');
              }
              ?>
              <tr>
                <td><?= htmlspecialchars($p['cliente_nome']) ?></td>
                <td><?= date('d/m/Y H:i', strtotime($p['data'])) ?></td>
                <td><?= strtoupper($p['metodo_autenticacao']) ?></td>
                <td><span class="status-badge <?= $statusClass ?>"><?= strtoupper($p['status']) ?></span></td>
                <td><?= $p['hora_entrada'] ? date('H:i', strtotime($p['hora_entrada'])) : '-' ?></td>
                <td><?= $p['hora_saida'] ? date('H:i', strtotime($p['hora_saida'])) : '-' ?></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    <?php endif; ?>

    <!-- Observações -->
    <div class="observacoes no-break" style="margin-top: 20px;">
      <div class="secao-titulo">Observações e Recomendações</div>
      <ul>
        <li>Relatório gerado automaticamente pelo sistema de gestão da academia.</li>
        <li>Total de <strong><?= $resumo['total'] ?></strong> registros de presença entre <?= $periodo['inicio'] ?> e <?= $periodo['fim'] ?>.</li>
        <li>Face ID representou <strong><?= $resumo['total'] > 0 ? round(($resumo['faceid'] / $resumo['total']) * 100, 1) : 0 ?>%</strong> das autenticações, consolidando-se como o principal método de identificação.</li>
        <li>Monitorar clientes com múltiplas falhas de autenticação pode reduzir ainda mais a taxa de erro.</li>
      </ul>
    </div>

    <!-- Assinatura -->
    <div class="assinatura-box">
      <div class="assinatura-linha">
        <div></div>
        <strong>Responsável Técnico / Coordenador</strong><br>
        <small style="color: #666;">Sistema de Gestão Fitness Prime</small>
      </div>
    </div>

    <!-- Rodapé -->
    <div class="rodape-relatorio clearfix">
      <div class="rodape-left">
        <strong>Sistema de Gestão Fitness Prime</strong><br>
        Relatório gerado em <?= $gerado_em ?>
      </div>
      <div class="rodape-right">
        <strong>Página 1 de 1</strong><br>
        Confidencial - Uso Interno
      </div>
    </div>
  </div>
</body>

</html>