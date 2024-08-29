<?php

namespace App\Controllers;

use App\Models\AcademiaModel;
use App\Models\Progressoconfig;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class Academia extends BaseController
{
    protected $model;
    protected $progressomodel;

    public function __construct()
    {
        $this->model = new AcademiaModel;
        $this->progressomodel = new Progressoconfig;
    }

    public function create()
    {
        $logo = $this->request->getFile('logo');

        if ($logo->isValid() && !$logo->hasMoved()) {
            $nomeimg = $logo->getRandomName();
            $logo->move('assets/Logo-academia', $nomeimg);
            $caminhoImagem = 'assets/Logo-academia/' . $nomeimg;
        }

        // Receber os outros dados do formulário
        $dados = [
            'nome' => $this->request->getPost('nomeAcad'),
            // 'horarioFuncionamento' => $this->request->getPost('horarioFuncionamento'),
            'endereco' => $this->request->getPost('endereco'),
            'telefone' => $this->request->getPost('telefoneAcademia'),
            'cnpj' => $this->request->getPost('cnpj'),
            'logo' => $caminhoImagem,
            'email' => $this->request->getPost('emailAcademia'),
            'descricao' => $this->request->getPost('descricaoAcad'),
            'data_modificacao' => date("Y-m-d"),
        ];

        if ($this->model->insert($dados)) {
            if ($this->model->affectedRows() > 0) {
                $cdados = [
                    "etapa_atual" => "2",
                ];
                $this->progressomodel->insert($cdados);
                $msg = array("msg" => "Configuração enviada");
                return $this->response->setJSON($msg)->setStatusCode(200);
            } else {
                $msg = array("msg" => "Nenhuma linha inserida");
                return $this->response->setJSON($msg)->setStatusCode(200);
            }
        } else {
            $error = $this->model->error();
            echo "Erro na inserção: " . $error['message'];
        }
    }

    public function read()
    {
        $dados = $this->progressomodel->select('*')
            ->get();

        if (!empty($dados)) {
            return $this->response->setJson($dados->getResult())->setStatusCode(200);
        } else {
            return $this->response->setJson('false')->setStatusCode(200);
        }
    }

    public function readAcademia()
    {
        $dados = $this->model->select('*')
            ->get();

        if (!empty($dados)) {
            return $this->response->setJson($dados->getResult())->setStatusCode(200);
        } else {
            return $this->response->setJson('false')->setStatusCode(200);
        }
    }

    public function nextStep()
    {
        date_default_timezone_set('America/Sao_Paulo');
        $data = $this->request->getJson();
        switch ($data->etapa) {
            case "Academia":
                echo "Academia";
                break;
            case "Planos":
                $etapa = [
                    "etapa_atual" => "3",
                ];
                $date = ['data_ultima_atualizacao' => date('Y-m-d H:i:s')];

                $this->progressomodel->update(1, $etapa, $date);
                $msg = array("msg" => "Configuração enviada");
                return $this->response->setJSON($msg)->setStatusCode(200);
                break;
            case "Funcionario":
                $etapa = [
                    "etapa_atual" => "4",
                ];
                $date = ['data_ultima_atualizacao' => date('Y-m-d H:i:s')];

                $this->progressomodel->update(1, $etapa, $date);
                $msg = array("msg" => "Configuração enviada");
                return $this->response->setJSON($msg)->setStatusCode(200);
                break;
            default:
                echo "dados incorretos";
        }
    }
}
