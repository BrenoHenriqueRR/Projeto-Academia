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
        }else{
            $error = $this->model->error();
            return $this->response->setJSON(["msg" => "Erro na inserção:" . $error['message']])->setStatusCode(200);
        }
    }
}
