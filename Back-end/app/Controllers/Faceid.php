<?php

namespace App\Controllers;

use Aws\Rekognition\RekognitionClient;
use App\Controllers\BaseController;
use App\Models\FaceidModel;
use CodeIgniter\HTTP\ResponseInterface;

class Faceid extends BaseController
{
    private $model;

    public function __construct()
    {
        $this->model = new FaceidModel();
    }

    public function create()
    {
        $cliente_id = 70; // Id do cliente fixo para testes

        // Diretório base onde as imagens serão salvas
        $base_dir = 'assets/selfies-clientes/' . $cliente_id;

        // Verifica se a pasta do cliente já existe, se não, cria
        if (!is_dir($base_dir)) {
            mkdir($base_dir, 0755, true);  // Cria o diretório com permissões apropriadas
        }

        $dados = $this->request->getJSON();

        $foto = $dados->imagem;

        // Remove o cabeçalho data:image/png;base64, para processar o dado binário
        $imagem = str_replace('data:image/png;base64,', '', $foto);
        $imagem = base64_decode($imagem);

        // Gera um nome único para o arquivo
        $nome_arquivo = rand(1000, 10000) . '-' . $cliente_id . '.png';
        $caminho_imagem = $base_dir . '/' . $nome_arquivo;

        // Salva a imagem no caminho correto
        file_put_contents($caminho_imagem, $imagem);

        // Atualiza o caminho da imagem na tabela selfies_clientes
        $data = [
            'cliente_id' => $cliente_id,
            'caminho_imagem' => $caminho_imagem
        ];
        $this->model->insert($data);

        $msg = array("msg" => "Imagem cadastrada com sucesso!");
        return $this->response->setJSON($msg)->setStatusCode(200);
    }

    public function verificarFaceId()
    {
        $data = $this->request->getJSON();

        $selfies = $this->model->findAll();
        $imagem_cliente = $data->imagem;

        foreach ($selfies as $selfie) { // testa com todas as fotos do banco para localizar se existe uma foto igual e libera o acesso

            
            // Passar o caminho da imagem no disco
            $caminhoImagemCliente = $selfie['caminho_imagem'];

            print_r($caminhoImagemCliente);

            if (!file_exists($caminhoImagemCliente)) {
                continue;
            }
            // $imagem_banco = file_get_contents($caminhoImagemCliente);
            // $imagem_banco = base64_encode($imagem_banco);
            $comparar = $this->compararImagens($imagem_cliente, $caminhoImagemCliente);

            //echo $comparar;
            if ($comparar) {
                $msg = array("msg" => "Acesso liberado com sucesso!");
                return $this->response->setJSON($msg)->setStatusCode(200);
            }
        }

        // Se nenhuma imagem for correspondente
        $msg = array("msg" => "Acesso negado! Nenhuma correspondência encontrada.");
        return $this->response->setJSON($msg)->setStatusCode(403);
    }

    private function compararImagens($imagemBase64, $caminhoImagemBanco)
    {
        $client = new RekognitionClient([
            'version' => 'latest',
            'region'  => 'us-east-1', // Região 
            'credentials' => [ // Chaves concedidas pela AWS
                'key'    => 'AKIA27TQ5KDG3AHXJDNR',
                'secret' => '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',
            ],
            'suppress_php_deprecation_warning' => true,
            'http' => [
                'verify' => false, // Desabilita a verificação do certificado
            ],
        ]);

        // Decodifica a imagem base64 enviada pelo cliente
        // remove o cabeçalho correspondente
        if (strpos($imagemBase64, 'data:image/jpeg;base64,') === 0) {
            $imagemBase64Cliente = str_replace('data:image/jpeg;base64,', '', $imagemBase64);
        } elseif (strpos($imagemBase64, 'data:image/png;base64,') === 0) {
            $imagemBase64Cliente = str_replace('data:image/png;base64,', '', $imagemBase64);
        } else {
            $imagemBase64Cliente = null; // se n for png ou jpeg
        }
        $imagemClienteBinario = base64_decode($imagemBase64Cliente);
        if ($imagemClienteBinario === false) {
            return false; // Erro ao decodificar a imagem do cliente
        }

        // Lê a imagem salva no servidor e converte para binário
        if (!file_exists($caminhoImagemBanco)) {
            return false; // Arquivo da imagem no servidor não encontrado
        }

        $imagemBancoBinario = file_get_contents($caminhoImagemBanco);
        if ($imagemBancoBinario === false) {
            return false; // Erro ao ler a imagem do servidor
        }

        try {
            $result = $client->compareFaces([
                'SourceImage' => [
                    'Bytes' => $imagemClienteBinario, // Decodifica a imagem enviada pelo cliente
                ],
                'TargetImage' => [
                    'Bytes' => $imagemBancoBinario, // Decodifica a imagem armazenada no banco
                ],
                'SimilarityThreshold' => 90,
            ]);


            if (count($result['FaceMatches']) > 0) {
                return true; // Se as fotos se assemelham, retorna true
            } else {
                return false;
            }
        } catch (\Exception $e) {
            log_message('error', $e->getMessage());
            var_dump($e->getMessage());
            return false;
        }
    }
} 
