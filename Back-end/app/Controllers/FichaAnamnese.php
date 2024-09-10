<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class FichaAnamnese extends BaseController
{
    private $model;

    public function __construct()
    {
        $this->model; //= new ModelPlanos();
    }


    public function create()
    {
        $data = $this->request->getJson();

        if ($this->model->insert($data)) {
            if ($this->model->affectedRows() > 0) {
                return $this->response->setJSON(['msg' => 'Ficha cadastrada com sucesso'])->setStatusCode(200);
            }
        }else{
            $error = $this->model->error();
            return $this->response->setJSON(["msg" => "Erro na inserção:" . $error['message']])->setStatusCode(200);
        }
    }

    public function edit(){
        $data = $this->request->getJson();
        
        $this->model->where('id', $data->id)
        ->set($data)
        ->update();

        $msg = array("msg" => "Ficha editado com sucesso !!");
        return $this->response->setJson($msg)->setStatusCode(200);
        
    }
    public function read(){
        // $data = $this->request->getJson();
        
        $dados = $this->model->select()
        ->get();

        return $this->response->setJson($dados->getResult())->setStatusCode(200);
        
    }
      public function delete(){
        $data = $this->request->getJson();
            
        $this->model->where('id', $data->id)
        ->delete();

        $msg = array("msg" => "Ficha excluido com sucesso !!");
        return $this->response->setJson($msg)->setStatusCode(200);
        
    }
}
