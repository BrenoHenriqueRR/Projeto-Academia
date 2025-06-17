<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\DespesaModel;
use CodeIgniter\HTTP\ResponseInterface;
use Exception;
use DateTime;
use DateInterval;

class Despesas extends BaseController
{
    protected $model;

    public function __construct()
    {
        $this->model = new DespesaModel();
    }

    public function read()
    {
        try {
            $dados = $this->model->findAll();
            return $this->response->setJSON($dados)->setStatusCode(200);
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function readId()
    {
        try {
            $id = $this->request->getJSON(true);
            $data = $this->model->find($id['id']);
            return $data
                ? $this->response->setJSON($data)->setStatusCode(200)
                : $this->response->setJSON(['error' => 'Despesa não encontrada'])->setStatusCode(404);
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function create()
    {
        try {
            $data = $this->request->getJSON(true);
            $this->model->insert($data);
            return $this->response->setJSON(['status' => 'Despesa adicionada'])->setStatusCode(201);
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update()
    {
        try {
            $data = $this->request->getJSON(true);
            $this->model->update($data['id'], $data);
            return $this->response->setJSON(['status' => 'Despesa atualizada'])->setStatusCode(200);
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function delete()
    {
        try {
            $id = $this->request->getJSON(true);
            $this->model->delete($id['id']);
            return $this->response->setJSON(['status' => 'Despesa removida'])->setStatusCode(200);
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => $e->getMessage()])->setStatusCode(500);
        }
    }

     public function pagar()
    {
        try {
            $requestData = $this->request->getJSON(true);
            $id = $requestData['id'];

            // Busca a despesa no banco
            $despesa = $this->model->find($id);

            if (!$despesa) {
                return $this->response->setJSON(['error' => 'Despesa não encontrada'])->setStatusCode(404);
            }

            if ($despesa['status'] == 'pago') {
                return $this->response->setJSON(['error' => 'Esta despesa já foi paga.'])->setStatusCode(400); // Bad Request
            }

            // Inicia a transação para garantir a integridade dos dados
            $this->model->db->transStart();

            $this->model->update($id, ['pago' => true]);

            if ($despesa['tipo'] === 'fixa') {
                $novaDespesa = $despesa;

                // Remove o ID para que seja um novo registro
                unset($novaDespesa['id']);
                
                // A nova despesa nasce como 'não paga'
                $novaDespesa['status'] = 'pendente'; 

                // Calcula a data de vencimento para o próximo mês
                // Assumindo que a tabela tem uma coluna 'vencimento' (formato YYYY-MM-DD)
                $dataVencimento = new DateTime($despesa['data_criacao']);
                $dataVencimento->add(new DateInterval('P1M')); // P1M = Período de 1 Mês
                $novaDespesa['data_criacao'] = $dataVencimento->format('Y-m-d');
                
                // Insere a nova despesa no banco de dados
                $this->model->insert($novaDespesa);
            }

            // Completa a transação
            $this->model->db->transComplete();

            if ($this->model->db->transStatus() === false) {
                 // Se a transação falhou, retorna um erro
                return $this->response->setJSON(['error' => 'Falha ao processar o pagamento. A operação foi revertida.'])->setStatusCode(500);
            }

            $message = $despesa['tipo'] === 'fixa' 
                ? 'Despesa paga e renovada para o próximo mês.' 
                : 'Despesa paga com sucesso.';

            return $this->response->setJSON(['status' => $message])->setStatusCode(200);

        } catch (Exception $e) {
            return $this->response->setJSON(['error' => $e->getMessage()])->setStatusCode(500);
        }
    }
}
