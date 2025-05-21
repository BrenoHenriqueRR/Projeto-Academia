<?php

namespace App\Controllers;

use App\Models\AcademiaModel;
use App\Models\Progressoconfig;
use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;
use Exception;

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
        try {
            $logo = $this->request->getFile('logo');

            if ($logo->isValid() && !$logo->hasMoved()) {
                $nomeimg = $logo->getRandomName();
                $logo->move('assets/Logo-academia', $nomeimg);
                $caminhoImagem = 'assets/Logo-academia/' . $nomeimg;
            } else {
                $caminhoImagem = null;
            }

            $dados = [
                'nome' => $this->request->getPost('nomeAcad'),
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
                    return $this->response->setJSON(["msg" => "Configuração enviada"])->setStatusCode(200);
                } else {
                    return $this->response->setJSON(["msg" => "Nenhuma linha inserida"])->setStatusCode(200);
                }
            } else {
                $error = $this->model->errors();
                return $this->response->setJSON(["error" => $error])->setStatusCode(500);
            }
        } catch (Exception $e) {
            return $this->response->setJSON(["error" => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function read()
    {
        try {
            $dados = $this->progressomodel->select('*')->get();

            if (!empty($dados)) {
                return $this->response->setJSON($dados->getResult())->setStatusCode(200);
            } else {
                return $this->response->setJSON('false')->setStatusCode(200);
            }
        } catch (Exception $e) {
            return $this->response->setJSON(["error" => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function readAcademia()
    {
        try {
            $dados = $this->model->select('*')->get();

            if (!empty($dados)) {
                return $this->response->setJSON($dados->getResult())->setStatusCode(200);
            } else {
                return $this->response->setJSON('false')->setStatusCode(200);
            }
        } catch (Exception $e) {
            return $this->response->setJSON(["error" => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function nextStep()
    {
        try {
            date_default_timezone_set('America/Sao_Paulo');
            $data = $this->request->getJson();

            switch ($data->etapa) {
                case "Academia":
                    return $this->response->setJSON(["msg" => "Etapa atual: Academia"])->setStatusCode(200);

                case "Planos":
                    $etapa = ["etapa_atual" => "3"];
                    $date = ['data_ultima_atualizacao' => date('Y-m-d H:i:s')];
                    $this->progressomodel->update(1, array_merge($etapa, $date));
                    return $this->response->setJSON(["msg" => "Configuração enviada"])->setStatusCode(200);

                case "Funcionario":
                    $etapa = ["etapa_atual" => "4"];
                    $date = ['data_ultima_atualizacao' => date('Y-m-d H:i:s')];
                    $this->progressomodel->update(1, array_merge($etapa, $date));
                    return $this->response->setJSON(["msg" => "Configuração enviada"])->setStatusCode(200);

                default:
                    return $this->response->setJSON(["error" => "Dados incorretos"])->setStatusCode(400);
            }
        } catch (Exception $e) {
            return $this->response->setJSON(["error" => $e->getMessage()])->setStatusCode(500);
        }
    }
}
