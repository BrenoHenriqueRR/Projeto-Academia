<?php

namespace App\Controllers;

use App\Models\FuncionariosModel;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class Funcionarios extends BaseController
{
    protected $model; 

    public function __construct(){
        $this->model = new FuncionariosModel();
    }

    public function create()
    {
        $foto = $this->request->getFile('foto');

        if ($foto->isValid() && !$foto->hasMoved()) {
            $nomeimg = $foto->getRandomName();
            $foto->move('assets/fotos-funcionarios', $nomeimg);
            $caminhoImagem = 'assets/fotos-funcionarios/' . $nomeimg;
        }

        // Receber os outros dados do formulário
        $dados = [
            'nome' => $this->request->getPost('nome'),
            'funcao' => $this->request->getPost('funcao'),
            'telefone' => $this->request->getPost('telefone'),
            'CPF' => $this->request->getPost('CPF'),
            'foto' => $caminhoImagem,
            'email' => $this->request->getPost('email'),
            'senha' => hash('sha256',$this->request->getPost('senha')),
            'data_nascimento' => $this->request->getPost('data_nascimento'),
        ];

        $this->model->insert($dados);

        return $this->response->setJson(["msg" => "Funcionário cadastrado !!"])->setStatusCode(200);
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
