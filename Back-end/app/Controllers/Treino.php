<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\Treinoexer;
use App\Models\Treinogrupo;
use App\Models\TreinoModel;
use App\Models\TreinoTipo;
use CodeIgniter\HTTP\ResponseInterface;

class Treino extends BaseController
{
    protected $model; 
    protected $fichamodel;
    protected $exer;
    protected $grupo;
    protected $tipo;

    public function __construct(){
        $this->model = new TreinoModel();
        $this->exer = new Treinoexer();
        $this->grupo = new Treinogrupo();
        $this->tipo = new TreinoTipo();
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


        $dados = $this->model->select('
            t.id, 
            t.series, 
            t.repeticoes, 
            e.exercicio AS exercicio, 
            g.grupo AS grupo, 
            tr.tipo AS tipo, 
            f.id AS funcionario_id, 
            c.id AS cliente_id,
            g.id AS grupo_id,
            e.id AS exer_id,
            tr.id AS tipo_id
        ');
        $this->model->from('treinos2 t');
        $this->model->join('execicio e', 't.exer_id = e.id');
        $this->model->join('treino_grupo g', 't.grupo_id = g.id');
        $this->model->join('treino_tipo tr', 't.treino_id = tr.id');
        $this->model->join('funcionarios f', 't.funcionario_id = f.id');
        $this->model->join('cliente c', 't.cliente_id = c.id');
        $this->model->where('c.id', $data['cliente_id']);
        $this->model->groupBy('id');

        $data = $dados->get();

      
        return $this->response->setJSON($data->getResult())->setStatusCode(200);

    }

    public function cadexer()
    {

        $json = file_get_contents('php://input');
                
        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $this->exer->insert($data);

        $msg = array("msg" => "Exercicio Enviado");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }
   
    public function cadgrupo()
    {

        $json = file_get_contents('php://input');
                
        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $this->grupo->insert($data);
        

        $msg = array("msg" => "Grupo Enviado");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }

    public function ptipo(){
        $json = file_get_contents('php://input');
                
        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $dados = $this->tipo->select();
        $data = $dados->get();  

        return $this->response->setJSON($data->getResult())->setStatusCode(200);

    }
    public function pgrupo(){
        $json = file_get_contents('php://input');
                
        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $dados = $this->grupo->select();
        $data = $dados->get();  

        return $this->response->setJSON($data->getResult())->setStatusCode(200);

    }

    public function pexer(){
        $json = file_get_contents('php://input');
                
        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $dados = $this->exer->select();
        $data = $dados->get();  

        return $this->response->setJSON($data->getResult())->setStatusCode(200);

    }



    

}
