<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\ExtrasModel;
use App\Models\PlanosExtra;
use CodeIgniter\HTTP\ResponseInterface;

class Extras extends BaseController
{
    private $model;
    private $planos_extras;

    public function __construct()
    {
        $this->model = new ExtrasModel;
        $this->planos_extras = new PlanosExtra;
    }

    public function create()
    {
        $data = $this->request->getJson();

        $dados_extra = [
            "nome" => $data->nome_extra,
            "descricao" => $data->descricao_extra,
            "preco" => $data->preco,
            "status" => $data->status,
        ];


        if ($this->model->insert($dados_extra)) {
            if ($this->model->affectedRows() > 0) {
                $ultimoID = $this->model->insertID();
                $dados_planos_extra = [
                    "plano_id" => $data->plano_id,
                    "extra_id" => $ultimoID
                ];
                $this->planos_extras->insert($dados_planos_extra);
                return $this->response->setJSON(['msg' => 'Extra cadastrado'])->setStatusCode(200);
            }
        }else{
            $error = $this->model->error();
            return $this->response->setJSON(["msg" => "Erro na inserção:" . $error['message']])->setStatusCode(200);
        }
    }

    public function edit()
    {
        $data = $this->request->getJson();

        $dados = $this->model->where('id', $data['id'])
            ->set($data)
            ->update();

        $msg = array("msg" => "Plano editado com sucesso !!");
        return $this->response->setJson($msg)->setStatusCode(200);
    }
    public function read()
    {
        // $data = $this->request->getJson();

        $dados = $this->model->select()
            ->get();

        return $this->response->setJson($dados->getResult())->setStatusCode(200);
    }
    public function delete()
    {
        $data = $this->request->getJson();

        $this->model->where('id', $data['id'])
            ->delete();

        $msg = array("msg" => "Plano extra excluido com sucesso !!");
        return $this->response->setJson($msg)->setStatusCode(200);
    }
}
