<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Relatório Financeiro</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 14px; }
    h1 { text-align: center; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
    th { background-color: #f4f4f4; }
    .total { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Relatório Financeiro - <?= $mes ?>/<?= $ano ?></h1>
  <p><strong>Gerado em:</strong> <?= $data_geracao ?></p>

  <table>
    <tr>
      <th>Item</th>
      <th>Valor (R$)</th>
    </tr>
    <tr>
      <td>Total de Pagamentos</td>
      <td><?= number_format($pagamentos, 2, ',', '.') ?></td>
    </tr>
    <tr>
      <td>Total de Vendas</td>
      <td><?= number_format($vendas, 2, ',', '.') ?></td>
    </tr>
    <tr>
      <td>Total de Despesas</td>
      <td><?= number_format($despesas, 2, ',', '.') ?></td>
    </tr>
    <tr class="total">
      <td>Lucro Líquido</td>
      <td><?= number_format($lucro, 2, ',', '.') ?></td>
    </tr>
  </table>
</body>
</html>
