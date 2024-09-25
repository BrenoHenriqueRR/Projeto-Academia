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
        // $cliente_id = $this->request->getPost('id');
        $cliente_id = 68;
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
 
         $caminho_imagem = file_put_contents('assets/selfies-clientes/' . $cliente_id . '/' . rand(1000,10000) . '-' . $cliente_id . '.png', $imagem);

        // Atualiza o caminho da imagem na tabela selfies_clientes
        $data = [
            'cliente_id' => $cliente_id,
            'caminho_imagem' => $caminho_imagem
        ];
        $msg = array("msg" => "imagem cadastro com sucesso !!");
        return $this->response->setJson($msg)->setStatusCode(200);
    }


    private function compararImagens($caminho1, $caminho2)
    {
        $client = new RekognitionClient([
            'version' => 'latest',
            'region'  => 'sa-east-1',//sao paulo região
            'credentials' => [ //chaves concedidas pela aws
                'key'    => 'AKIA6ODU3OE2TJP3GNHX',
                'secret' => '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',
            ],
        ]);

        try {
            $result = $client->compareFaces([
                'SourceImage' => [
                    'Bytes' => file_get_contents($caminho1), //imagem 1
                ],
                'TargetImage' => [
                    'Bytes' => file_get_contents($caminho2), //imagem 2
                ],
                'SimilarityThreshold' => 90, // Porcentagem mínima de similaridade
            ]);

            if (count($result['FaceMatches']) > 0) {
                return true; //se as fotos se assemelham retorna true
            } else {
                return false;
            }
        } catch (\Exception $e) {
            log_message('error', $e->getMessage());
            return false;
        }
    }
}
