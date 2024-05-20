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
        $this->model->where('funcao','personal');
        $data = $this->model->get();

        
        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }

    // public function login(){
    //     $json = file_get_contents('php://input');
    //     $data = json_decode($json, true);
        
    //     if ($data && isset($data['email']) && isset($data['senha'])) {
    //         $this->model->where('email', $data['email']);
    //         $this->model->where('senha', $data['senha']);
    //         $query = $this->model->get();
    
    //         if ($query->getResult()) {
    //             // O email e a senha existem no banco de dados
    //             $msg = array("msg" => "true");
    //             return $this->response->setJSON($msg)->setStatusCode(200);
    //         } else {
    //             // O email e/ou a senha não existem
    //             $msg = array("msg" => "false");
    //             return $this->response->setJSON($msg)->setStatusCode(200);
    //         }

    //     } else {
    //         //dados ausentes ou inválidos
    //         $msg = array("msg" => "Erro nos dados enviados");
    //         return $this->response->setJSON($msg)->setStatusCode(200);
    //     }        
    //  }
}
