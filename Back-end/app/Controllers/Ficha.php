<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\FichaModel;
use CodeIgniter\HTTP\ResponseInterface;

class Ficha extends BaseController
{
    protected $model; 

    public function __construct(){
        $this->model = new FichaModel();
    }

    public function create(){
        $json = file_get_contents('php://input');
                
        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        foreach($data as $dados){
            $this->model->insert($dados);
        }

        $msg = array("msg" => "Cadastro Enviado");

        return $this->response->setJSON($msg)->setStatusCode(200);

    }

    // public function pesquisarcont($data){
    //     return $this->model->select('contagem')
    //     ->where('id', $data);
    // }
}
