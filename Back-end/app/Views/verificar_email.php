<!DOCTYPE html>
<html>
<head>
    <title>Verificação de Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .content {
            font-size: 16px;
            line-height: 1.6;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: black;
            background-color: #E7F53D;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verifique seu Email</h1>
        </div>
        <div class="content">
            <p>Olá,</p>
            <p>Obrigado por se cadastrar! Para ativar sua conta, clique no botão abaixo:</p>
            <a class="button" href="<?= env('FRONTEND_URL') . "?id=" . $id ?>">Confirmar Email</a>
        </div>
        <div class="footer">
            <p>&copy; <?= date('Y') ?> Fitness Prime. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>
