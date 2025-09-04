<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\Planos as ModelPlanos;
use CodeIgniter\HTTP\ResponseInterface;

class Planos extends BaseController
{
    private $model;

    public function __construct()
    {
        $this->model = new ModelPlanos();
    }


    public function create()
    {
        $data = $this->request->getJson();

        if ($this->model->insert($data)) {
            if ($this->model->affectedRows() > 0) {
                return $this->response->setJSON(['msg' => 'Plano cadastrado'])->setStatusCode(200);
            }
        } else {
            $error = $this->model->error();
            return $this->response->setJSON(["msg" => "Erro na inserção:" . $error['message']])->setStatusCode(200);
        }
    }

    public function edit()
    {
        $dados = $this->request->getJSON(true); 

        $id = $dados['id'];
        unset($dados['id']); // destruiu para não gerar conflito no update

        $dados['data_modificacao'] = date('Y-m-d H:i:s');

        if ($this->model->update($id, $dados)) {
            return $this->response->setJSON(['status' => 'sucesso']);
        }

        return $this->response->setJSON(['status' => 'erro']);
    }
    public function read()
    {
        // $data = $this->request->getJson();

        $dados = $this->model->select()
            ->get();

        return $this->response->setJson($dados->getResult())->setStatusCode(200);
    }
    public function readId($id)
    {

        $dados = $this->model->find($id);
        if ($dados) {
            return $this->response->setJson($dados)->setStatusCode(200);
        } else {
            return $this->response->setJson(["msg" => ['Registro não encontrado com o ID: ' . $id]])->setStatusCode(200);
        }
    }

    public function delete()
    {
        $data = $this->request->getJson();

        $this->model->where('id', $data->id)
            ->delete();

        $msg = array("msg" => "Plano excluido com sucesso !!");
        return $this->response->setJson($msg)->setStatusCode(200);
    }
}
