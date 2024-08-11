<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatorio de estátistica</title>
    <style>
        .header {
            border-bottom: 2px solid black;
            border-top: 2px solid black;
            line-height: 1.2rem;
            text-align: center;
        }

        .header h2 {
            font-size: 18px;
        }

        table {
            border-collapse: collapse;
            margin-top: 1rem;
            width: 100%;
        }

        th {
            border-bottom: 1px solid gray;
        }

        .estatistica {
            width: 100%;
        }

        th,
        td {
            padding: 3px 5px;
            text-align: left;
        }

        .total-right {
            text-align: right;
        }

        .cli {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Relatorio de estátistica do cliente</h1>
        <h2>Campos do jordão, Fitness Prime</h2>
        <p>(12) 9 996569274</p>
        <p><?=  date("d/m/Y") ?></p>
    </div>
    <div class="estatistica">
        <div class="cli">
            <h3>ID: <?= $cliente_id ?></h3>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Exercício</th>
                    <th>Carga</th>
                    <th>Concluído</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Supino</td>
                    <td>60 kg</td>
                    <td>Sim</td>
                </tr>
                <tr>
                    <td>Agachamento</td>
                    <td>80 kg</td>
                    <td>Sim</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td class="total-right" colspan="2"><strong>Total de Exercícios Concluídos: </strong></td>
                    <td><?= $total_exercicios_concluidos ?></td>
                </tr>
            </tfoot>
        </table>
    </div>
</body>

</html>