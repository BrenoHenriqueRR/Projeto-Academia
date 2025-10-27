<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório de Presença - <?= $nome_mes ?>/<?= $ano ?></title>
  <style>
    body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #333; margin: 0; padding: 0; }
    .clearfix::after { content: ""; display: table; clear: both; }
    .header-empresa { border-bottom: 2px solid #000; padding: 10px 0; margin-bottom: 20px; }
    .logo-empresa { float: left; width: 15%; }
    .empresa-info { float: left; width: 55%; padding-left: 10px; }
    .relatorio-titulo { float: right; width: 30%; text-align: right; }
    .periodo-info { margin-bottom: 15px; }
    .periodo-left { float: left; width: 50%; }
    .periodo-right { float: right; width: 50%; text-align: right; }
    .no-break { page-break-inside: avoid; }
    .resumo-cards { display: flex; flex-wrap: wrap; gap: 10px; }
    .card-resumo { flex: 1; background: #f8f8f8; padding: 10px; border-radius: 5px; text-align: center; border: 1px solid #ccc; }
    .label { font-weight: bold; font-size: 12px; }
    .valor { font-size: 14px; margin-top: 5px; }
    .valor-positivo { color: green; }
    .valor-negativo { color: red; }
    .valor-neutro { color: #333; }
    .secao-tabela { margin-top: 20px; }
    .secao-titulo { font-weight: bold; font-size: 14px; border-bottom: 2px solid #000; margin-bottom: 10px; }
    .tabela-pdf { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
    .tabela-pdf th, .tabela-pdf td { border: 1px solid #ccc; padding: 6px; font-size: 12px; text-align: center; }
    .status-badge { padding: 2px 6px; border-radius: 3px; color: #fff; font-weight: bold; }
    .status-sucesso { background-color: green; }
    .status-erro { background-color: red; }
    .assinatura-box { margin-top: 40px; text-align: center; }
    .assinatura-linha div { border-top: 1px solid #000; width: 50%; margin: 0 auto 5px; }
    .rodape-relatorio { font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 10px; margin-top: 30px; }
    .rodape-left { float: left; }
    .rodape-right { float: right; text-align: right; }
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
        <h4>PRESENÇA</h4>
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
      <h5 style="margin-bottom: 10px; font-size: 14px;">Resumo Executivo</h5>
      <div class="resumo-cards">
        <div class="card-resumo">
          <div class="label">TOTAL DE REGISTROS</div>
          <div class="valor valor-neutro"><?= $resumo['total'] ?></div>
        </div>
        <div class="card-resumo">
          <div class="label">SUCESSOS</div>
          <div class="valor valor-positivo"><?= $resumo['sucesso'] ?></div>
        </div>
        <div class="card-resumo">
          <div class="label">ERROS</div>
          <div class="valor valor-negativo"><?= $resumo['erro'] ?></div>
        </div>
        <div class="card-resumo">
          <div class="label">FACE ID</div>
          <div class="valor valor-neutro"><?= $resumo['faceid'] ?></div>
        </div>
        <div class="card-resumo">
          <div class="label">PIN</div>
          <div class="valor valor-neutro"><?= $resumo['pin'] ?></div>
        </div>
      </div>
    </div>

    <!-- Análise Detalhada -->
    <div class="analise-detalhada no-break" style="margin-top: 20px;">
      <h5 style="margin-bottom: 10px; font-size: 14px;">Análise Detalhada</h5>
      <p>Total de clientes diferentes: <strong><?= $resumo['clientes_unicos'] ?></strong></p>
      <p>Taxa de sucesso: 
        <strong class="valor-positivo">
          <?= number_format(($resumo['sucesso'] / $resumo['total']) * 100, 1, ',', '.') ?>%
        </strong>
      </p>
      <p>Taxa de erro: 
        <strong class="valor-negativo">
          <?= number_format(($resumo['erro'] / $resumo['total']) * 100, 1, ',', '.') ?>%
        </strong>
      </p>
    </div>

    <!-- Tabela de Presenças -->
    <?php if (!empty($presencas)): ?>
    <div class="secao-tabela">
      <div class="secao-titulo">Registros de Presença</div>
      <table class="tabela-pdf">
        <thead>
          <tr>
            <th width="20%">Cliente</th>
            <th width="20%">Data</th>
            <th width="15%">Método</th>
            <th width="15%">Status</th>
            <th width="15%">Entrada</th>
            <th width="15%">Saída</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach($presencas as $p): ?>
          <tr>
            <td><?= htmlspecialchars($p['cliente_nome']) ?></td>
            <td><?= date('d/m/Y H:i', strtotime($p['data'])) ?></td>
            <td><?= strtoupper($p['metodo_autenticacao']) ?></td>
            <td>
              <span class="status-badge status-<?= strtolower($p['status']) ?>">
                <?= strtoupper($p['status']) ?>
              </span>
            </td>
            <td><?= $p['hora_entrada'] ? date('H:i', strtotime($p['hora_entrada'])) : '-' ?></td>
            <td><?= $p['hora_saida'] ? date('H:i', strtotime($p['hora_saida'])) : '-' ?></td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
    <?php endif; ?>

    <!-- Observações -->
    <div class="observacoes no-break">
      <div class="secao-titulo">Observações</div>
      <ul>
        <li>Relatório gerado automaticamente pelo sistema de controle de presença.</li>
        <li>Total de <?= $resumo['total'] ?> registros neste período.</li>
        <li>Taxa de sucesso de <?= number_format(($resumo['sucesso'] / $resumo['total']) * 100, 1, ',', '.') ?>%.</li>
      </ul>
    </div>

    <!-- Assinatura -->
    <div class="assinatura-box">
      <div class="assinatura-linha">
        <div></div>
        <strong>Responsável Técnico</strong><br>
        <small style="color: #666;">Sistema de Gestão de Presenças</small>
      </div>
    </div>

    <!-- Rodapé -->
    <div class="rodape-relatorio clearfix">
      <div class="rodape-left">
        <strong>Sistema de Gestão</strong><br>
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
