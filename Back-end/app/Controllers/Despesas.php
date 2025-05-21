<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\DespesaModel;
use CodeIgniter\HTTP\ResponseInterface;
use Exception;

class Despesas extends BaseController
{
    protected $model;

    public function __construct()
    {
        $this->model = new DespesaModel();
    }

    public function read()
    {
        try {
            $dados = $this->model->findAll();
            return $this->response->setJSON($dados)->setStatusCode(200);
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function readId()
    {
        try {
            $id = $this->request->getJSON(true);
            $data = $this->model->find($id['id']);
            return $data
                ? $this->response->setJSON($data)->setStatusCode(200)
                : $this->response->setJSON(['error' => 'Despesa não encontrada'])->setStatusCode(404);
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function create()
    {
        try {
            $data = $this->request->getJSON(true);
            $this->model->insert($data);
            return $this->response->setJSON(['status' => 'Despesa adicionada'])->setStatusCode(201);
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update()
    {
        try {
            $data = $this->request->getJSON(true);
            $this->model->update($data['id'], $data);
            return $this->response->setJSON(['status' => 'Despesa atualizada'])->setStatusCode(200);
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function delete()
    {
        try {
            $id = $this->request->getJSON(true);
            $this->model->delete($id['id']);
            return $this->response->setJSON(['status' => 'Despesa removida'])->setStatusCode(200);
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => $e->getMessage()])->setStatusCode(500);
        }
    }
}
