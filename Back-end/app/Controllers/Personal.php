<?php

namespace App\Controllers;

use App\Models\PersonalModel;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class Personal extends BaseController
{
    protected $model; 

    public function __construct(){
        $this->model = new PersonalModel();
    }

    public function create()
    {
        
    }

    public function pesquisar(){
        $this->model->select('*');
        $data = $this->model->get();
        
        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }
}
