<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\ExtrasModel;
use App\Models\PlanosExtra;
use CodeIgniter\HTTP\ResponseInterface;

class Extras extends BaseController
{
    private $model;
    // private $planos_extras;

    public function __construct()
    {
        $this->model = new ExtrasModel;
        // $this->planos_extras = new PlanosExtra;
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
                // $this->planos_extras->insert($dados_planos_extra);
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
         $id = $data->id;
        unset($data->id); // destruiu para não gerar conflito no update
        try {
            $this->model->update($id, $data);
    
            $msg = array("msg" => "Plano Extra editado com sucesso !!");
            return $this->response->setJSON($msg)->setStatusCode(200);
        } catch (\Throwable $th) {
            $error = array("msg" => "Erro ao editar o plano extra!", "Erro" => $th->getMessage());
            return $this->response->setJSON($error)->setStatusCode(500);
        }
    }

    public function read()
    {
        // $data = $this->request->getJson();

        $dados = $this->model->select()
            ->get();

        return $this->response->setJSON($dados->getResult())->setStatusCode(200);
    }

    public function readId()
    {
        $data = $this->request->getJson();

        $dados = $this->model->select()
        ->where('id', $data->id)
        ->get();

        return $this->response->setJson($dados->getResult())->setStatusCode(200);
    }


    public function delete()
    {
        $data = $this->request->getJSON();

        $this->model->where('id', $data->id)
            ->delete();

        $msg = array("msg" => "Plano extra excluido com sucesso !!");
        return $this->response->setJSON($msg)->setStatusCode(200);
    }
}
