<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\AnamneseModel;
use CodeIgniter\HTTP\ResponseInterface;

class Anamnese extends BaseController
{
    protected $model;

    public function __construct()
    {
        $this->model = new AnamneseModel();
    }

    public function create()
    {
        try {
            $data = $this->request->getJSON(true);

            // Inserção no banco de dados
            $this->model->insert($data);

            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_CREATED)
                ->setJSON([
                    'success' => true,
                    'msg' => 'Anamnese cadastrado com sucesso!'
                ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON([
                    'success' => false,
                    'msg' => 'Ocorreu um erro! Tente novamente.',
                    'error' => $e->getMessage()
                ]);
        }
    }

    public function read()
    {
        try {
            // Inserção no banco de dados
            $dados = $this->model
                 ->select('cliente.nome, anamnese.*,') // Pegando apenas o nome do cliente
                ->join('cliente', 'cliente.id = anamnese.cliente_id') // Ligação entre as tabelas
                ->findAll();
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_CREATED)
                ->setJSON([
                    'success' => true,
                    'dados' => $dados
                ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON([
                    'success' => false,
                    'msg' => 'Ocorreu um erro! Tente novamente.',
                    'error' => $e->getMessage()
                ]);
        }
    }

    public function deleteAnamnese()
    {
        try {
            $id = $this->request->getJSON(true);
            $this->model->delete($id);
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_OK)
                ->setJSON([
                    'success' => true,
                    'msg' => 'Anamnese Excluida com sucesso!',
                ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON([
                    'success' => false,
                    'msg' => 'Ocorreu um erro ao excluir o Anamnese.',
                    'error' => $e->getMessage(),
                ]);
        }
    }
}
