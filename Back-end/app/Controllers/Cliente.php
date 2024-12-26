<?php

namespace App\Controllers;

use App\Models\ClienteModel;
use CodeIgniter\Database\Query;

class Cliente extends BaseController
{
    protected $model;
    protected $ClientesPlanoModel;
    protected $ClientesPlanoExtraModel;

    public function __construct()
    {
        $this->model = new ClienteModel();
        $this->ClientesPlanoModel = new ClienteModel();
        $this->model = new ClienteModel();
    }

    public function create()
    {

        $data = $this->request->getjSON();

        var_dump( $data->extras[1] );
        die();
        if (isset($data)) {
            $this->model->select('*');
            $this->model->where('email', $data->email);
            $validaremail = $this->model->countAllResults(); // traz a quantidade de resultados da consulta

            if ($validaremail == 0) {
                $senhahash = hash('sha256', $data->senha);

                $data->senha = $senhahash;
                $this->model->insert($data);

                $msg = array("msg" => "Cadastro Enviado");
                return $this->response->setJSON($msg)->setStatusCode(200);
            } else
                return $this->response->setJSON('Email ja existe')->setStatusCode(200);
        } else {
            $dados = [
                'nome' => $this->request->getPost('nome'),
                'endereco' => $this->request->getPost('endereco'),
                'telefone' => $this->request->getPost('telefone'),
                'CPF' => $this->request->getPost('CPF'),
                'datanascimento' => $this->request->getPost('data_nascimento'),
                'email' => $this->request->getPost('email'),
                'senha' => hash('sha256', $this->request->getPost('senha')),
            ];
            $foto = $this->request->getFile('foto');

            if (isset($foto)) {
                if ($foto->isValid() && !$foto->hasMoved()) {
                    $nomeimg = $foto->getRandomName();
                    $foto->move('assets/fotos-perfil', $nomeimg);
                    $caminhoImagem = 'assets/fotos-perfil/' . $nomeimg;
                    $dados['foto_perfil'] = $caminhoImagem;
                }
            }

            // Receber os outros dados do formulário

            $this->model->insert($dados);
            $msg = array("msg" => "Cadastro Enviado");
            return $this->response->setJSON($msg)->setStatusCode(200);
        }
    }
    public function delete()
    {

        $json = file_get_contents('php://input');

        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $this->model->where('id', $data['id'])
            ->delete();

        $msg = array("msg" => "Cliente deletado");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }

    public function login()
    {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $logindate = date("Y-m-d");
        $senhahash = hash('sha256', $data['senha']);


        if ($data && isset($data['email']) && isset($data['senha'])) {
            $this->model->where('email', $data['email']);
            $this->model->where('senha', $senhahash);
            $query = $this->model->get();

            if ($query->getResult()) {
                $result = $query->getRow();
                if($result){
                    $msg = array([
                        "msg" => "true",
                        "id" => $result->id
                    ]);
                }
                // O email e a senha existem no banco de dados
                $this->model->where('email', $data['email'])
                    ->where('senha', $senhahash)
                    ->set([
                        'ultimo_login' => $logindate,
                        'status' => 'ativo'
                    ])
                    ->update();
                return $this->response->setJSON($msg)->setStatusCode(200);
            } else {
                // O email e/ou a senha não existem
                $msg = array(["msg" => "false"]);
                return $this->response->setJSON($msg)->setStatusCode(200);
            }
        } else {
            //dados ausentes ou inválidos
            $msg = array("msg" => "Erro nos dados enviados");
            return $this->response->setJSON($msg)->setStatusCode(200);
        }
    }

    public function pesquisar()
    {
        $dados = $this->model->select('c.id, c.nome AS cliente_nome, c.CPF, c.email,c.ultimo_login,c.status, p.nome AS nome_personal, p.id as id_func')
            ->from('cliente AS c')
            ->join('funcionarios AS p', 'c.personal_id = p.id', 'LEFT')
            ->groupBy('c.id');
        // $dados = $this->model->select('*');

        $data = $dados->get();

        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }
    public function pesquisarpid()
    {

        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $dados = $this->model->select('c.id, c.nome AS cliente_nome, c.CPF, c.email,p.id as funcionario_id, p.nome AS nome_personal')
            ->from('cliente AS c')
            ->join('funcionarios AS p', 'c.personal_id = p.id', 'INNER')
            ->where('c.id', $data['id'])
            ->groupBy('c.id');

        $data = $dados->get();

        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }
    public function pesquisarid()
    {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $dados = $this->model->select('id')
            ->where('email', $data['email']);

        $data = $dados->get();

        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }

    public function inserirFoto()
    {
        //apagar imagem anterior do usuário
        $file = $this->request->getFile('foto');
        $id = $this->request->getPost('id');

        $dados = $this->model->select('foto_perfil')
            ->where('id', $id);
        $query = $dados->get();
        if (!isset($query)) {
            foreach ($query->getResult() as $row) {
                unlink($row->foto_perfil);
            }
        }


        // inserir imagem de perfil do usuário
        if ($file->isValid() && !$file->hasMoved()) {
            $nomeimg = $file->getRandomName(); //gera um nome aleatorio a foto
            $file->move('assets/fotos-perfil', $nomeimg); // move a imagem para a pasta
            $caminhoImagem = 'assets/fotos-perfil/' . $nomeimg;
            $this->model->where('id', $id)
                ->set([
                    'foto_perfil' => $caminhoImagem
                ])
                ->update();
            $msg = array("msg" => "Foto de perfil alterada com sucesso!!");
            return $this->response->setJSON($msg)->setStatusCode(200);
        } else {
            $msg = array("msg" => "Ocorreu um erro ao alterar a foto, tente novamente!");
            return $this->response->setJSON($msg)->setStatusCode(200);
        }
    }

    public function pegarFoto()
    {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $dados = $this->model->select('foto_perfil')
            ->where('id', $data['id']);

        $data = $dados->get();

        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }

    public function trocarSenha()
    {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $this->model->where('email', $data['email'])
            ->set([
                "senha" => $data['senha']
            ])
            ->update();

        $msg = array("msg" => "Senha alterada com sucesso !!");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }
}
