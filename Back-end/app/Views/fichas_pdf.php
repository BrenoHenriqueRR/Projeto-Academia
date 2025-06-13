<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <title>Ficha de Musculação</title>
    <style>
        /* O CSS permanece o mesmo, pois atende aos dois layouts */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            font-size: 14px;
        }

        .page-break {
            page-break-before: always;
        }

        .ficha-container {
            max-width: 100%;
            border: 2px solid #000;
            padding: 15px;
        }

        .header-table,
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .logo-cell {
            width: 120px;
            vertical-align: middle;
        }

        .logo-cell img {
            width: 100px;
            height: auto;
        }

        .title-cell {
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            vertical-align: middle;
        }

        .info-container {
            border: 1px solid #000;
            padding: 15px;
            border-radius: 10px;
        }

        .info-label {
            font-weight: bold;
            padding-right: 5px;
        }

        .info-line {
            border-bottom: 1px solid #000;
            width: 100%;
            font-size: 14px;
        }

        .series-table {
            width: 100%;
            border-spacing: 20px 0;
            border-collapse: separate;
            margin-top: 10px;
        }

        .serie-cell {
            width: 50%;
            vertical-align: top;
            page-break-inside: avoid;
        }

        .serie-header {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .exercise-list {
            border: 1px solid #000;
            border-radius: 10px;
            padding: 10px;
            height: 450px;
        }

        .exercise-item {
            border-bottom: 1px dotted #888;
            padding: 6px 2px;
            font-size: 14px;
        }

        .exercise-obs {
            font-size: 11px;
            color: #555;
            padding-left: 5px;
        }
    </style>
</head>

<body>

    <?php if (count($fichas_agrupadas) > 2): ?>

        <?php
        // Prepara os dados para cada página
        $fichas_pagina1 = array_slice($fichas_agrupadas, 0, 2, true);
        $fichas_pagina2 = array_slice($fichas_agrupadas, 2, null, true);
        ?>

        <div class="ficha-container">
            <table class="header-table">
                <tr>
                    <td class="logo-cell"><img src="<?= 'http://localhost/sites/Projeto1/Back-end/public/assets/Logo-academia/logo2.png' ?>" alt="Logo"></td>
                    <td class="title-cell">Ficha de Musculação</td>
                </tr>
            </table>
            <div class="info-container">
                <table class="info-table">
                    <tr>
                        <td class="info-label">Nome:</td>
                        <td class="info-line" style="width: 60%;"><?= esc($cliente_nome ?? '') ?></td>
                        <td class="info-label" style="padding-left: 15px;">Prof Resp:</td>
                        <td class="info-line" style="width: 25%;"><?= esc($personal_nome ?? '') ?></td>
                    </tr>
                    <tr>
                        <td class="info-label">Objetivo:</td>
                        <td class="info-line"><?= esc($objetivo ?? '') ?></td>
                        <td class="info-label" style="padding-left: 15px;">Término:</td>
                        <td class="info-line"></td>
                    </tr>
                </table>
            </div>
            <table class="series-table">
                <tr><?php foreach ($fichas_pagina1 as $tipo_serie => $exercicios) : ?><td class="serie-cell">
                            <div class="serie-header">Série <?= esc($tipo_serie) ?></div>
                            <div class="exercise-list"><?php foreach ($exercicios as $ex) : ?><div class="exercise-item"><span><?php echo esc($ex->exercicio) . ' ' . esc($ex->series) . 'x' . esc($ex->repeticoes) ?></span></div><?php if (!empty($ex->observacoes)): ?>
                                        <div class="exercise-obs"><i>Obs: <?= esc($ex->observacoes) ?></i></div><?php endif; ?><?php endforeach; ?>
                            </div>
                        </td><?php endforeach; ?></tr>
            </table>
        </div>

        <div class="page-break"></div>

        <div class="ficha-container">
            <table class="series-table">
                <tr><?php foreach ($fichas_pagina2 as $tipo_serie => $exercicios) : ?><td class="serie-cell">
                            <div class="serie-header">Série <?= esc($tipo_serie) ?></div>
                            <div class="exercise-list"><?php foreach ($exercicios as $ex) : ?><div class="exercise-item"><span><?php echo esc($ex->exercicio) . ' ' . esc($ex->series) . 'x' . esc($ex->repeticoes) ?></span></div><?php if (!empty($ex->observacoes)): ?><div class="exercise-obs"><i>Obs: <?= esc($ex->observacoes) ?></i></div><?php endif; ?><?php endforeach; ?></div>
                        </td><?php endforeach; ?></tr>
            </table>
        </div>

    <?php else: ?>

        <div class="ficha-container">
            <table class="header-table">
                <tr>
                    <td class="logo-cell"><img src="<?= 'http://localhost/sites/Projeto1/Back-end/public/assets/Logo-academia/logo2.png' ?>" alt="Logo"></td>
                    <td class="title-cell">Ficha de Musculação</td>
                </tr>
            </table>
            <div class="info-container">
                <table class="info-table">
                    <tr>
                        <td class="info-label">Nome:</td>
                        <td class="info-line" style="width: 60%;"><?= esc($cliente_nome ?? '') ?></td>
                        <td class="info-label" style="padding-left: 15px;">Prof Resp:</td>
                        <td class="info-line" style="width: 25%;"><?= esc($personal_nome ?? '') ?></td>
                    </tr>
                    <tr>
                        <td class="info-label">Objetivo:</td>
                        <td class="info-line"><?= esc($objetivo ?? '') ?></td>
                        <td class="info-label" style="padding-left: 15px;">Término:</td>
                        <td class="info-line"></td>
                    </tr>
                </table>
            </div>
            <table class="series-table">
                <tr>
                    <?php foreach ($fichas_agrupadas as $tipo_serie => $exercicios) : ?>
                        <td class="serie-cell">
                            <div class="serie-header">Série <?= esc($tipo_serie) ?></div>
                            <div class="exercise-list">
                                <?php foreach ($exercicios as $ex) : ?>
                                    <div class="exercise-item"><span><?php echo esc($ex->exercicio) . ' ' . esc($ex->series) . 'x' . esc($ex->repeticoes) ?></span></div>
                                    <?php if (!empty($ex->observacoes)): ?>
                                        <div class="exercise-obs"><i>Obs: <?= esc($ex->observacoes) ?></i></div>
                                    <?php endif; ?>
                                <?php endforeach; ?>
                            </div>
                        </td>
                    <?php endforeach; ?>
                </tr>
            </table>
        </div>

    <?php endif; ?>

</body>

</html>