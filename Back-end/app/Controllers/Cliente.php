<?php
namespace App\Controllers;

use App\Models\ClienteModel;
use CodeIgniter\Database\Query;

class Cliente extends BaseController
{
    protected $model; 

    public function __construct(){
        $this->model = new ClienteModel();
    }

    public function create()
    {

        $json = file_get_contents('php://input');
        
        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        // if($this->model->where('email', $data['email'])){
        //     return $this->response->setJSON('Email ja existe')->setStatusCode(200);
        // }

        $this->model->insert($data);

        $msg = array("msg" => "Cadastro Enviado");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }

    public function login(){
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        if ($data && isset($data['email']) && isset($data['senha'])) {
            $this->model->where('email', $data['email']);
            $this->model->where('senha', $data['senha']);
            $query = $this->model->get();
    
            if ($query->getResult()) {
                // O email e a senha existem no banco de dados
                $msg = array("msg" => "true");
                return $this->response->setJSON($msg)->setStatusCode(200);
            } else {
                // O email e/ou a senha não existem
                $msg = array("msg" => "false");
                return $this->response->setJSON($msg)->setStatusCode(200);
            }

        } else {
            //dados ausentes ou inválidos
            $msg = array("msg" => "Erro nos dados enviados");
            return $this->response->setJSON($msg)->setStatusCode(200);
        }        
     }

     public function pesquisar(){
        $dados = $this->model->select('c.id, c.nome AS cliente_nome, c.CPF, c.email, p.nome AS nome_personal')
        ->from('cliente AS c')
        ->join('funcionarios AS p', 'c.personal_id = p.id', 'INNER')
        ->groupBy('c.id');
 
        $data = $dados->get();  
 
        return $this->response->setJSON($data->getResult())->setStatusCode(200);
 
    }
     public function pesquisarid(){
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $dados = $this->model->select('id')
        ->where('email',$data['email'] );
 
        $data = $dados->get();  
 
        return $this->response->setJSON($data->getResult())->setStatusCode(200);
 
    }
 }

?>
