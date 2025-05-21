<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\FichaExerciciosModel;
use App\Models\FichaModel;
use App\Models\TipoGrupo;
use CodeIgniter\HTTP\ResponseInterface;
use Exception;

class Ficha extends BaseController
{
    protected $fichamodel;
    protected $fichaexermodel;
    protected $tipogrupo;

    public function __construct()
    {
        $this->fichamodel = new FichaModel();
        $this->fichaexermodel = new FichaExerciciosModel();
    }

    public function create()
    {
        try {
            $data = $this->request->getJSON(true);

            $clienteId = $data['cliente_id'];
            $tipo = $data['tipo'];
            $ordem = $data['ordem'];
            $exercicios = $data['exercicios']; // array com os exercícios da ficha

            // Cadastra a ficha
            $this->fichamodel->insert([
                'cliente_id' => $clienteId,
                'tipo' => $tipo,
                'ordem' => $ordem,
                'concluida' => false
            ]);

            $fichaId = $this->fichamodel->insertID();

            // Cadastra os exercícios da ficha
            foreach ($exercicios as $ex) {
                $this->fichaexermodel->insert([
                    'ficha_id' => $fichaId,
                    'exercicio_id' => $ex['exercicio_id'],
                    'repeticoes' => $ex['repeticoes'],
                    'series' => $ex['series'],
                    'observacoes' => $ex['observacoes'] ?? null
                ]);
            }

            return $this->response->setJSON(['msg' => 'Ficha cadastrada com sucesso']);
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => 'Erro ao criar ficha: ' . $e->getMessage()]);
        }
    }

    public function pesquisar()
    {
        try {
            // Função vazia no seu código original
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => 'Erro ao pesquisar: ' . $e->getMessage()]);
        }
    }

    public function pesquisarCli()
    {
        try {
            $clienteId = $this->request->getJSON();

            if (isset($clienteId->soficha)) {
                $fichas = $this->fichamodel->select()->where('cliente_id', $clienteId->id)->get()->getResult();
            } else {
                $fichas = $this->fichamodel
                    ->select('fichas.id AS ficha_id, fichas.tipo, fichas.ordem, fichas.concluida,
                          ficha_exercicios.id AS ficha_exercicio_id, exercicios.nome AS exercicio,
                          grupos_musculares.nome AS grupo_muscular,
                          ficha_exercicios.repeticoes,
                          ficha_exercicios.series, ficha_exercicios.observacoes')
                    ->join('ficha_exercicios', 'ficha_exercicios.ficha_id = fichas.id')
                    ->join('exercicios', 'exercicios.id = ficha_exercicios.exercicio_id')
                    ->join('grupos_musculares', 'grupos_musculares.id = exercicios.grupo_muscular_id')
                    ->where('fichas.cliente_id', $clienteId->id)
                    ->orderBy('fichas.ordem', 'ASC')
                    ->findAll();
            }

            return $this->response->setJSON($fichas);
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => 'Erro ao buscar fichas do cliente: ' . $e->getMessage()]);
        }
    }

    public function fichaNaoConcluida()
    {
        try {
            $clienteId = $this->request->getJSON();

            $ficha = $this->fichamodel
                ->select('id, tipo, ordem, concluida')
                ->where('cliente_id', $clienteId->id)
                ->where('concluida', false)
                ->orderBy('ordem', 'ASC')
                ->limit(1)
                ->get()
                ->getRow();

            if ($ficha) {
                $exercicios = $this->fichamodel
                    ->select('ficha_exercicios.id AS ficha_exercicio_id, exercicios.nome AS exercicio,
                      grupos_musculares.nome AS grupo_muscular,
                      ficha_exercicios.repeticoes,
                      ficha_exercicios.series, ficha_exercicios.observacoes')
                    ->join('ficha_exercicios', 'ficha_exercicios.ficha_id = fichas.id')
                    ->join('exercicios', 'exercicios.id = ficha_exercicios.exercicio_id')
                    ->join('grupos_musculares', 'grupos_musculares.id = exercicios.grupo_muscular_id')
                    ->where('fichas.id', $ficha->id)
                    ->orderBy('ficha_exercicios.id', 'ASC')
                    ->get()
                    ->getResult();

                return $this->response->setJSON([
                    'ficha' => $ficha,
                    'exercicios' => $exercicios,
                ]);
            } else {
                return $this->response->setJSON(["msg" => "Nenhuma ficha encontrada"]);
            }
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => 'Erro ao buscar ficha não concluída: ' . $e->getMessage()]);
        }
    }

    public function concluirFicha()
    {
        try {
            $dados = $this->request->getJSON();
            $this->fichamodel->table('fichas')
                ->where('id', $dados['fichas'])
                ->update(['concluida' => 1]);

            return $this->response->setJSON(['status' => 'sucess', 'ficha_concluida' => 'Ficha concluida com sucesso']);
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => 'Erro ao concluir ficha: ' . $e->getMessage()]);
        }
    }

    public function resetarFichasSeTodasConcluidas($cliente_id)
    {
        try {
            $total = $this->fichamodel->where('cliente_id', $cliente_id)->countAllResults();
            $concluidas = $this->fichamodel->where(['cliente_id' => $cliente_id, 'concluida' => 1])->countAllResults();

            if ($total > 0 && $total === $concluidas) {
                $this->fichamodel->where('cliente_id', $cliente_id)->update(['concluida' => 0]);
                return true;
            }

            return false;
        } catch (Exception $e) {
            return false;
        }
    }
}
