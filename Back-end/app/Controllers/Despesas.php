<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\DespesaModel;
use CodeIgniter\HTTP\ResponseInterface;

class Despesas extends BaseController
{
    protected $model;
    public function __construct()
    {
        $this->model = new DespesaModel();
    }
    public function read()
    {

        return $this->response->setJSON($this->model->findAll());
    }

    public function readId()
    {
        $id = $this->request->getJSON(true);
        $data = $this->model->find($id['id']);
        return $data ? $this->response->setJSON($data) : $this->response->setStatusCode(404);
    }

    public function create()
    {
        
        $data = $this->request->getJSON(true);
        $this->model->insert($data);
        return $this->response->setJSON(['status' => 'Despesa adicionada']);
    }

    public function update()
    {
        $data = $this->request->getJSON(true);
        $this->model->update($data['id'], $data);
        return $this->response->setJSON(['status' => 'Despesa atualizada']);
    }

    public function delete()
    {
         $id = $this->request->getJSON(true);
        $this->model->delete($id['id']);
        return $this->response->setJSON(['status' => 'Despesa removida']);
    }
}
