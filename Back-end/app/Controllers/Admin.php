<?php

namespace App\Controllers;

use App\Models\FuncionariosModel;
use App\Models\ClienteModel;


use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class Admin extends BaseController
{
    protected $model; 
    protected $modelcli; 

    public function __construct(){
        $this->model = new FuncionariosModel();
        $this->modelcli = new ClienteModel();
    }


    public function login(){
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $senhahash = hash('sha256', $data['senha']);
        
        if ($data && isset($data['email']) && isset($data['senha'])) {
            $this->model->where('email', $data['email']);
            $this->model->where('senha', $senhahash);
            $query = $this->model->get();
    
            if ($query->getResult()) {
                //Se o email e a senha existem no banco de dados
                $msg = array("msg" => "true");
                return $this->response->setJSON($msg)->setStatusCode(200);
            } else {
                $msg = array("msg" => "false");
                return $this->response->setJSON($msg)->setStatusCode(200);
            }

        } else {
            //dados ausentes ou inválidos
            $msg = array("msg" => "Erro nos dados enviados");
            return $this->response->setJSON($msg)->setStatusCode(200);
        }        
     }

     public function funcao(){
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $this->model->select('*');
        $this->model->where('email',$data['email']);
        $dados = $this->model->get();

        
        return $this->response->setJSON($dados->getResult())->setStatusCode(200);
    }

     public function funcaoPncli(){
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $this->model->select('*');
        $this->model->where('id',$data['id']);
        $dados = $this->model->get();

        
        return $this->response->setJSON($dados->getResult())->setStatusCode(200);
    }

    public function buscar(){
        $json = file_get_contents('php://input');
        $datajson = json_decode($json, true);

        $dados = $this->modelcli->select('c.id, c.nome AS cliente_nome,c.foto_perfil, c.CPF, c.email,c.personal_id, p.nome AS nome_personal')
        ->from('cliente AS c')
        ->join('funcionarios AS p', 'c.personal_id = p.id', 'LEFT')
        ->where('c.id', $datajson['id'])
        ->groupBy('c.id');

        $data = $dados->get();
        if ($data) {
            $result = $data->getRow();
            if($result){
                if(file_exists($result->foto_perfil)){
                    $result->verifi_img = 'true';
                }else{
                    $result->verifi_img = 'false';
                }
            }
        }


        return $this->response->setJSON($result)->setStatusCode(200);

    }

    public function buscarfun(){

        $json = file_get_contents('php://input');

        $data = json_decode($json, true);

        $dados = $this->model->select('*');

        $data = $dados->get();  

        return $this->response->setJSON($data->getResult())->setStatusCode(200);

    }

    public function deletefun()
    {

        $json = file_get_contents('php://input');
        
        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $this->model->where('id',$data['id'])
        ->delete();

        $msg = array("msg" => "Funcionario deletado");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }

    public function buscarfuncionario(){
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $dados = $this->model->select('*')
        ->where('id', $data['id']);

        $data = $dados->get();  

        return $this->response->setJSON($data->getResult())->setStatusCode(200);

    }

    public function editar()
    {

        $json = file_get_contents('php://input');
        
        $data = json_decode($json, true);
        //pegar o id do personal
        // $this->model->select('*');
        // $this->model->where('id', $data['id'] );
     
        // // Verifica se a consulta retornou algum resultado antes de tentar acessá-lo
        // // echo $personal['id'];


        $this->modelcli->set($data)
        ->where('id',$data['id'])
        ->update();

        $msg = array("msg" => "Cadastro Editado Com Sucesso !!");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }

    public function editfuncionario()
    {

        $json = file_get_contents('php://input');
        
        $data = json_decode($json, true);

        $this->model->set($data)
        ->where('id',$data['id'])
        ->update();

        $msg = array("msg" => "Cadastro Editado");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }
}
