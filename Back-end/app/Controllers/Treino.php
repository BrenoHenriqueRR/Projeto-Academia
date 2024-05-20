<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\TreinoModel;
use CodeIgniter\HTTP\ResponseInterface;

class Treino extends BaseController
{
    protected $model; 
    protected $fichamodel;

    public function __construct(){
        $this->model = new TreinoModel();
    }

    public function create()
    {

        $json = file_get_contents('php://input');
                
        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        foreach($data as $dados){
            $this->model->insert($dados);
        }

        $msg = array("msg" => "Cadastro Enviado");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }

    public function pesquisar(){
        $json = file_get_contents('php://input');
                
        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $dados = $this->model->select()
        ->where('cliente_id',$data['cliente_id']);
        $data = $dados->get();  

        return $this->response->setJSON($data->getResult())->setStatusCode(200);

    }
    

}
