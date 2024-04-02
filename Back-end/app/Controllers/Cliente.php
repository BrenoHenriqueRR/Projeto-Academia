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
}

?>
