<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório Individual - <?= htmlspecialchars($cliente) ?></title>
  <style>
    body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #333; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
    .resumo-cards { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .card { flex: 1; background: #f8f8f8; border: 1px solid #ccc; margin: 0 5px; border-radius: 6px; padding: 10px; text-align: center; }
    .valor { font-size: 14px; font-weight: bold; }
    .verde { color: green; }
    .vermelho { color: red; }
    .tabela { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .tabela th, .tabela td { border: 1px solid #ccc; padding: 5px; font-size: 11px; text-align: center; }
    .assinatura { margin-top: 30px; text-align: center; }
  </style>
</head>
<body>

<div class="header">
  <h2>Relatório Individual de Presença</h2>
  <h4><?= htmlspecialchars($cliente) ?></h4>
  <p>Período: <?= $periodo['inicio'] ?> a <?= $periodo['fim'] ?></p>
</div>

<h4>Plano Contratado</h4>
<p><strong><?= $plano['nome'] ?></strong> — <?= $plano['dias_semana'] ?> dias/semana</p>

<div class="resumo-cards">
  <div class="card">
    <div>Dias Esperados</div>
    <div class="valor"><?= $plano['esperado'] ?></div>
  </div>
  <div class="card">
    <div>Dias Comparecidos</div>
    <div class="valor"><?= $plano['compareceu'] ?></div>
  </div>
  <div class="card">
    <div>Taxa de Comparecimento</div>
    <div class="valor <?= $plano['percentual'] >= 80 ? 'verde' : 'vermelho' ?>">
      <?= number_format($plano['percentual'], 1, ',', '.') ?>%
    </div>
  </div>
  <div class="card">
    <div>Tempo Total</div>
    <div class="valor"><?= $resumo['tempo_total'] ?></div>
  </div>
  <div class="card">
    <div>Tempo Médio</div>
    <div class="valor"><?= $resumo['tempo_medio'] ?></div>
  </div>
</div>

<h4>Registros de Presença</h4>
<table class="tabela">
  <thead>
    <tr>
      <th>Data</th>
      <th>Entrada</th>
      <th>Saída</th>
      <th>Tempo</th>
      <th>Método</th>
    </tr>
  </thead>
  <tbody>
    <?php foreach ($presencas as $p): 
      $tempo = '-';
      if ($p['hora_entrada'] && $p['hora_saida']) {
        $entrada = new DateTime($p['hora_entrada']);
        $saida = new DateTime($p['hora_saida']);
        $tempo = $entrada->diff($saida)->format('%Hh %Im');
      }
    ?>
    <tr>
      <td><?= date('d/m/Y', strtotime($p['data'])) ?></td>
      <td><?= $p['hora_entrada'] ?: '-' ?></td>
      <td><?= $p['hora_saida'] ?: '-' ?></td>
      <td><?= $tempo ?></td>
      <td><?= strtoupper($p['metodo_autenticacao']) ?></td>
    </tr>
    <?php endforeach; ?>
  </tbody>
</table>

<h4 style="margin-top:20px;">Análise</h4>
<ul>
  <li>O cliente compareceu a <?= $plano['compareceu'] ?> de <?= $plano['esperado'] ?> dias esperados.</li>
  <li>Taxa de adesão: <?= number_format($plano['percentual'], 1, ',', '.') ?>%.</li>
  <?php if ($plano['percentual'] >= 85): ?>
    <li><strong class="verde">Excelente engajamento!</strong> O cliente está utilizando o plano de forma ideal.</li>
  <?php elseif ($plano['percentual'] >= 65): ?>
    <li><strong>Boa presença</strong>, mas pode melhorar a constância semanal.</li>
  <?php else: ?>
    <li><strong class="vermelho">Baixa frequência:</strong> recomendado contato com o aluno para reforçar o acompanhamento.</li>
  <?php endif; ?>
</ul>

<div class="assinatura">
  <hr style="width:50%;">
  <p><strong>Responsável Técnico</strong><br><small>Sistema Fitness Prime</small></p>
</div>

</body>
</html>
    