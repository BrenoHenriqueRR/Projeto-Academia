<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\ExerciciosModel;
use App\Models\FichaModel;
use App\Models\GrupoMuscularModel;
use App\Models\TipoGrupo;
use App\Models\Treinoexer;
use App\Models\Treinogrupo;
use App\Models\TreinoModel;
use App\Models\TreinoTipo;
use CodeIgniter\HTTP\ResponseInterface;

class Treino extends BaseController
{
    protected $model;
    protected $fichamodel;
    protected $exer;
    protected $grupo;
    protected $tipo;
    protected $tipogrupo;

    public function __construct()
    {
        $this->model = new FichaModel();
        $this->exer = new ExerciciosModel();
        $this->grupo = new GrupoMuscularModel();
    }

    //Faz a pesquisa na tabela de grupo
    public function pgrupo()
    {
        $json = file_get_contents('php://input');

        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $dados = $this->grupo->select();
        $data = $dados->get();

        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }
    //Faz a pesquisa na tabela de exercicios
    public function pexer()
    {
        $json = file_get_contents('php://input');

        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $dados = $this->exer->select();
        $data = $dados->get();

        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }

    public function cadexer()
    {
        try {
            $data = $this->request->getJSON(true);

            // Inserção no banco de dados
            $this->exer->insert($data);

            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_CREATED)
                ->setJSON([
                    'success' => true,
                    'msg' => 'Exercício cadastrado com sucesso!'
                ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON([
                    'success' => false,
                    'msg' => 'Ocorreu um erro! Tente novamente.',
                    'error' => $e->getMessage()
                ]);
        }
    }
}
