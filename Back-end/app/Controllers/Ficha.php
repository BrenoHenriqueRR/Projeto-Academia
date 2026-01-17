<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\FichaExerciciosModel;
use App\Models\FichaModel;
use App\Models\HistoricoFichaModel;
use App\Models\TipoGrupo;
use CodeIgniter\HTTP\ResponseInterface;
use Exception;
use Dompdf\Dompdf;
use Dompdf\Options;

class Ficha extends BaseController
{
    protected $fichamodel;
    protected $historicofichamodel;
    protected $fichaexermodel;
    protected $tipogrupo;

    public function __construct()
    {
        $this->fichamodel = new FichaModel();
        $this->historicofichamodel = new HistoricoFichaModel();
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

    public function update()
    {
        try {
            $data = $this->request->getJSON(true);

            if (!isset($data['ficha_id'])) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'O ID da ficha é obrigatório para a atualização.']);
            }

            $fichaId = $data['ficha_id'];
            $tipo = $data['tipo'];
            $ordem = $data['ordem'];
            $exercicios = $data['exercicios'];

            $this->fichamodel->db->transStart();

            // 1. Atualiza os dados da ficha principal (tabela 'fichas')
            $this->fichamodel->update($fichaId, [
                'tipo'  => $tipo,
                'ordem' => $ordem,
            ]);

            // apaga todos os exercícios antigos associados a esta ficha para simplificar a ação
            $this->fichaexermodel->where('ficha_id', $fichaId)->delete();

            // 3. Insere a nova lista de exercícios (tabela 'ficha_exercicios')
            foreach ($exercicios as $ex) {
                $this->fichaexermodel->insert([
                    'ficha_id'     => $fichaId,
                    'exercicio_id' => $ex['exercicio_id'],
                    'repeticoes'   => $ex['repeticoes'],
                    'series'       => $ex['series'],
                    'observacoes'  => $ex['observacoes'] ?? null
                ]);
            }

            $this->fichamodel->db->transComplete();

            if ($this->fichamodel->db->transStatus() === false) {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON(['error' => 'Não foi possível atualizar a ficha. Ocorreu um erro no banco de dados.']);
            }

            // Se a transação foi bem-sucedida
            return $this->response->setJSON(['msg' => 'Ficha atualizada com sucesso']);
        } catch (Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON(['error' => 'Erro ao atualizar a ficha: ' . $e->getMessage()]);
        }
    }

    public function pesquisarFicha()
    {
        try {
            $id = $this->request->getJSON();
            $dados = $this->fichamodel
                ->select('fichas.id AS ficha_id,fichas.cliente_id, fichas.tipo, fichas.ordem, fichas.concluida,
                          ficha_exercicios.id AS ficha_exercicio_id, exercicios.nome AS exercicio,
                          grupos_musculares.nome AS grupo_muscular,
                          ficha_exercicios.repeticoes,
                          ficha_exercicios.series, ficha_exercicios.observacoes')
                ->join('ficha_exercicios', 'ficha_exercicios.ficha_id = fichas.id')
                ->join('exercicios', 'exercicios.id = ficha_exercicios.exercicio_id')
                ->join('grupos_musculares', 'grupos_musculares.id = exercicios.grupo_muscular_id')
                ->where('fichas.id', $id->id)
                ->orderBy('fichas.ordem', 'ASC')
                ->findAll();

            return $this->response->setJSON($dados)->setStatusCode(200);
        } catch (Exception $e) {
            return $this->response->setJSON(['error' => 'Erro ao pesquisar: ' . $e->getMessage()]);
        }
    }

    public function pesquisarAtivas()
    {
        $fichas = $this->fichamodel
            ->select('fichas.*, clientes_planos.data_vencimento')
            ->join('clientes_planos', 'clientes_planos.cliente_id = fichas.cliente_id')
            ->where('fichas.status', 'ativa')
            ->where('clientes_planos.data_vencimento >=', date('Y-m-d'))
            ->findAll();

        return $this->response->setJSON($fichas);
    }

    public function pesquisarPendentes()
    {
        return $this->response->setJSON(['msg' => 'Ficha pesquisada com sucesso!']);
    }

    public function pesquisarCli()
    {
        try {
            $clienteId = $this->request->getJSON();

            if (isset($clienteId->soficha)) {
                $fichas = $this->fichamodel
                    ->where('cliente_id', $clienteId->id)
                    ->orderBy('ordem', 'ASC')
                    ->findAll();
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


            $this->fichamodel->update($dados->fichas, [
                'concluida' => 1,
                'data_conclusao' => date('Y-m-d')
            ]);

            $ficha = $this->fichamodel->find($dados->fichas);

            $this->historicofichamodel->insert([
                'ficha_id' => $ficha['id'],
                'cliente_id' => $ficha['cliente_id'],
                'tipo' => $ficha['tipo'],
                'ordem' => $ficha['ordem'],
                'data_conclusao' => date('Y-m-d H:i:s')
            ]);


            $this->resetarFichasSeTodasConcluidas($dados->cliente_id);
            return $this->response->setJSON(['status' => 'sucess', 'msg' => 'Ficha concluida com sucesso']);
        } catch (Exception $e) {
            return $this->response->setJSON(['msg' => 'Erro ao concluir ficha ', 'error' => $e->getMessage()]);
        }
    }

    public function resetarFichasSeTodasConcluidas($cliente_id)
    {
        try {
            $total = $this->fichamodel->where('cliente_id', $cliente_id)->countAllResults();
            $concluidas = $this->fichamodel
                ->where(['cliente_id' => $cliente_id, 'concluida' => 1])
                ->countAllResults();

            if ($total > 0 && $total === $concluidas) {
                $this->fichamodel
                    ->where('cliente_id', $cliente_id)
                    ->set([
                        'concluida' => 0,
                        'data_conclusao' => null
                    ])
                    ->update();

                return true;
            }
        } catch (Exception $e) {
            print_r($e);
            return false;
        }
    }

    public function imprimirFichaId()
    {

        $json = $this->request->getJSON();
        $cliente_id = $json->id;


        $exerciciosRaw = $this->fichamodel
            ->select('
            fichas.id AS ficha_id, fichas.tipo, fichas.ordem,
            ficha_exercicios.id AS ficha_exercicio_id,
            exercicios.nome AS exercicio,
            grupos_musculares.nome AS grupo_muscular,
            ficha_exercicios.repeticoes,
            ficha_exercicios.series,
            ficha_exercicios.observacoes,
            ficha_exercicios.repeticoes,
            ficha_exercicios.series,
            cliente.nome AS cliente_nome,
            anamnese.perg_objetivos_saude AS objetivo,
            funcionarios.nome AS personal_nome
        ')
            ->join('ficha_exercicios', 'ficha_exercicios.ficha_id = fichas.id')
            ->join('exercicios', 'exercicios.id = ficha_exercicios.exercicio_id')
            ->join('grupos_musculares', 'grupos_musculares.id = exercicios.grupo_muscular_id')
            ->join('cliente', 'cliente.id = fichas.cliente_id')
            ->join('anamnese', 'anamnese.cliente_id = cliente.id', 'left')
            ->join('funcionarios', 'funcionarios.id = cliente.personal_id', 'left')
            ->where('fichas.cliente_id', $cliente_id)
            ->orderBy('fichas.ordem', 'ASC')
            ->orderBy('ficha_exercicios.id', 'ASC')
            ->get()
            ->getResult();

        // Verificação para caso o cliente não tenha fichas
        if (empty($exerciciosRaw)) {

            return redirect()->back()->with('error', 'Nenhuma ficha encontrada para este cliente.');
        }


        $dados_para_pdf = [
            'cliente_nome'  => $exerciciosRaw[0]->cliente_nome,
            'personal_nome' => $exerciciosRaw[0]->personal_nome,
            'objetivo'      => $exerciciosRaw[0]->objetivo,
            'fichas_agrupadas' => []
        ];

        // agrupar os exercícios por tipo de série (A, B, C...)
        foreach ($exerciciosRaw as $exercicio) {
            $dados_para_pdf['fichas_agrupadas'][$exercicio->tipo][] = $exercicio;
        }
        $html = view('fichas_pdf', $dados_para_pdf);

        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $options->set('chroot', FCPATH . 'img');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $nomeSeguro = url_title($dados_para_pdf['cliente_nome'], '-', true);
        $nomeArquivo = 'Ficha-de-treino-' . $nomeSeguro . '.pdf';

        return $this->response
            ->setHeader('Content-Type', 'application/pdf')
            ->setHeader('Content-Disposition', 'inline; filename="' . $nomeArquivo . '"')
            ->setBody($dompdf->output());
    }
}
