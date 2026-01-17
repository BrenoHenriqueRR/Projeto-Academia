<?php
// --- CONFIGURAÇÃO ---
$host = 'localhost';
$db   = 'projeto-1'; // <--- SEU BANCO
$user = 'root';              // <--- SEU USUÁRIO
$pass = '';                  // <--- SUA SENHA

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. JSON em Português (apenas para pegar os nomes traduzidos e estrutura)
    $urlJson = "https://raw.githubusercontent.com/joao-gugel/exercicios-bd-ptbr/main/exercises/exercises-ptbr-full-translation.json";
    
    // 2. Base URL das imagens ORIGINAIS (Yuhonas)
    // É aqui que garantimos que a imagem vai carregar sempre
    $baseUrlImagens = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

    echo "Baixando JSON...<br>";
    $json = file_get_contents($urlJson);
    $dados = json_decode($json, true);

    if (!$dados) die("Erro: JSON inválido.");

    // 3. Cria a tabela (limpando anterior)
    $pdo->exec("DROP TABLE IF EXISTS biblioteca_exercicios");
    $pdo->exec("CREATE TABLE biblioteca_exercicios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome_pt VARCHAR(255),
        imagem_url VARCHAR(500), 
        musculo VARCHAR(100),
        equipamento VARCHAR(100)
    )");

    echo "Importando e gerando links completos...<br>";

    $stmt = $pdo->prepare("INSERT INTO biblioteca_exercicios (nome_pt, imagem_url, musculo, equipamento) VALUES (?, ?, ?, ?)");

    $contador = 0;
    foreach ($dados as $ex) {
        $nome = $ex['name'] ?? 'Sem nome';
        
        // --- A MÁGICA ACONTECE AQUI ---
        $urlCompleta = null;
        if (isset($ex['images']) && count($ex['images']) > 0) {
            // Pega "Pasta/0.jpg" e junta com "https://raw.github..."
            $urlCompleta = $baseUrlImagens . $ex['images'][0];
        }

        $musculo = implode(', ', $ex['primaryMuscles'] ?? []);
        $equip   = $ex['equipment'] ?? null;

        $stmt->execute([$nome, $urlCompleta, $musculo, $equip]);
        $contador++;
    }

    echo "<h2>Sucesso!</h2>";
    echo "$contador exercícios importados.<br>";
    echo "Exemplo de URL salva: <b>$urlCompleta</b>";

} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
?>