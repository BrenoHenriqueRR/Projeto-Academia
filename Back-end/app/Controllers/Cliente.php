<?php

namespace App\Controllers;

use App\Models\ClienteModel;
use CodeIgniter\Database\Query;

class Cliente extends BaseController
{
    protected $model;
    protected $ClientesPlanoModel;
    protected $ClientesPlanoExtraModel;
    protected $email;


    public function __construct()
    {
        $this->model = new ClienteModel();
        $this->ClientesPlanoModel = new ClienteModel();
        $this->model = new ClienteModel();
        $this->email = new EmailController();
    }

    public function create()
    {
        $dados = [
            'nome' => $this->request->getPost('nome'),
            'CPF' => $this->request->getPost('CPF'),
            'RG' => $this->request->getPost('RG'),
            'telefone' => $this->request->getPost('telefone'),
            'email' => $this->request->getPost('email'),
            'endereco' => $this->request->getPost('endereco'),
            'datanascimento' => $this->request->getPost('data_nascimento'),
            'nivel_experiencia	' => $this->request->getPost('nivel_experiencia	'),
            'treino_com_personal' => $this->request->getPost('treino_com_personal'),
        ];
        $dados['personal_id'] = null !== $this->request->getPost('personal_id') ? $this->request->getPost('personal_id') : null;
        $foto = $this->request->getFile('foto');
        $atestado = null !== $this->request->getFile('atestado_medico') ? $this->request->getFile('atestado_medico') : null;
        $termo = null !== $this->request->getFile('termo_responsabilidade') ? $this->request->getFile('termo_responsabilidade') : null;

        if (isset($foto)) {
            if ($foto->isValid() && !$foto->hasMoved()) {
                $nomeimg = $foto->getRandomName();
                $foto->move('assets/fotos-perfil/', $nomeimg);
                $caminhoImagem = 'assets/fotos-perfil/' . $nomeimg;
                $dados['foto_perfil'] = $caminhoImagem;
            }
        }

        $dados['atestado_medico'] = $this->processarArquivo($atestado, 'atestado', $this->request->getPost('CPF'));
        $dados['termo_responsabilidade'] = $this->processarArquivo($termo, 'termo', $this->request->getPost('CPF'));

        // Receber os outros dados do formulário

        $this->model->insert($dados);
        $id = $this->model->getInsertID();

        $verif_email = array(
            'id' => $id,
            'email' => $dados['email']
        );
        $msg = array("msg" => "Cadastro Enviado");

        $this->email->verificaEmail($verif_email);

        return $this->response->setJSON($msg)->setStatusCode(200);
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
                if ($result) {
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

    public function verificarEmail($id)
    {
        $usuario = $this->model->where('id', $id)->first();
        if (!$usuario) {
            return $this->response->setJSON(['success' => false, 'message' => 'Token inválido.']);
        }

        $this->model->update($id, ['email_verificado' => 1]);

        return $this->response->setJSON(['success' => true, 'msg' => 'E-mail verificado!']);
    }

    public function criarSenha()
    {

        $dados = $this->request->getJSON();


        $result = $this->model->update($dados->id, ['senha' => hash('sha256', $dados->senha)]);

        if ($result) {
            return $this->response->setJSON(['success' => true, 'msg' => 'Senha verificada com sucesso!']);
        } else {
            return $this->response->setJSON(['success' => false, 'msg' => 'Ocorreu um erro!! Tente novamente']);
        }
    }

    public function pesquisar()
    {
        $dados = $this->model->select('c.*, p.nome AS nome_personal, p.id as id_func')
            ->from('cliente AS c')
            ->join('funcionarios AS p', 'c.personal_id = p.id', 'LEFT')
            ->groupBy('c.id');
        // $dados = $this->model->select('*');

        $data = $dados->get();

        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }
    public function pesquisarpid()
    {
        $data = $this->request->getJSON();
        $dados = $this->model->select('c.*,p.id as funcionario_id, p.nome AS nome_personal')
            ->from('cliente AS c')
            ->join('funcionarios AS p', 'c.personal_id = p.id', 'INNER')
            ->where('c.id', $data->id)
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

    public function processarArquivo($arquivo, $tipo, $cpf)
    {
        if ($arquivo != null && $arquivo->isValid() && !$arquivo->hasMoved()) {
            $nomearq = $arquivo->getRandomName();
            $diretorio = 'assets/' . $tipo . '/' . $cpf;
            $arquivo->move($diretorio, $nomearq);
            return $diretorio . '/' . $nomearq;
        }
        return null;
    }

    public function getClientesSemAnamnese()
    {

        $dados = $this->model->select('cliente.id, cliente.nome')
        ->join('anamnese', 'cliente.id = anamnese.cliente_id', 'left')
        ->where('anamnese.id', null)
        ->findAll();

        return $this->response->setJSON($dados)->setStatusCode(200);
    }
}
