<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\FichaExerciciosModel;
use App\Models\FichaModel;
use App\Models\TipoGrupo;
use CodeIgniter\HTTP\ResponseInterface;

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
                'carga' => $ex['carga'],
                'repeticoes' => $ex['repeticoes'],
                'series' => $ex['series'],
                'observacoes' => $ex['observacoes'] ?? null
            ]);
        }

        return $this->response->setJSON(['status' => 'Ficha cadastrada com sucesso']);
    }
}
