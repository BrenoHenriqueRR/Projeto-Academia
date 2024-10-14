<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\TipoGrupo;
use App\Models\Treinoexer;
use App\Models\Treinogrupo;
use App\Models\TreinoModel;
use App\Models\TreinoTipo;
use CodeIgniter\HTTP\ResponseInterface;

class Treino extends BaseController
{
    protected $model;
    protected $fichamodel;
    protected $exer;
    protected $grupo;
    protected $tipo;
    protected $tipogrupo;

    public function __construct()
    {
        $this->model = new TreinoModel();
        $this->exer = new Treinoexer();
        $this->grupo = new Treinogrupo();
        $this->tipo = new TreinoTipo();
        $this->tipogrupo = new TipoGrupo();
    }

    public function create()
    {
        $json = file_get_contents('php://input');

        $data = json_decode($json, true);

        $dataP1 = $data[0];

        //inserir dados no tipo_grupo
        $insert_tipogrupo = [
            'status' => 'Pendente',
            'treino_id' => $dataP1['treino_id'],
            'cliente_id' => $dataP1['cliente_id'],
            'grupo_id' => $dataP1['grupo_id'],
            'funcionario_id' => $dataP1['funcionario_id'],
        ];

        $this->tipogrupo->insert($insert_tipogrupo);
        $Ultimoid = $this->tipogrupo->insertID();

        foreach ($data as $dados) {
            $insert_treino = [
                'exer_id' => $dados['exer_id'],
                'series' => $dados['series'],
                'repeticoes' => $dados['repeticoes'],
                'tipo_grupo_id' => $Ultimoid,
            ];
            $this->model->insert($insert_treino);
        }

        $msg = array("msg" => "Cadastro Enviado");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }
    //faz a pesquisa dos treinos
    public function pesquisar()
    {
        // $json = file_get_contents('php://input');
        
        // // Decodificar o JSON em um array PHP
        // $data = json_decode($json, true);
        
        $data = $this->request->getJSON();

        $proximoTipoGrupo = $this->tipogrupo->where('cliente_id', $data->cliente_id)
            ->where('status', 'Pendente')
            ->orderBy('data_criacao', 'ASC')
            ->first();
        if ($proximoTipoGrupo) {
            $proximoTipoGrupoID = $proximoTipoGrupo['id'];
            $dados = $this->model->select('
            ct.id, 
            ct.series, 
            ct.repeticoes, 
            e.exercicio AS exercicio, 
            g.grupo AS grupo, 
            tr.tipo AS tipo, 
            tg.id AS tipo_grupo_id, 
            f.id AS funcionario_id, 
            c.id AS cliente_id,
            g.id AS grupo_id,
            e.id AS exer_id,
            tr.id AS tipo_id,
            tg.status AS status
            ')
                ->from('cad_treino ct')
                ->join('execicio e', 'ct.exer_id = e.id')
                ->join('tipo_grupo tg', 'ct.tipo_grupo_id = tg.id')
                ->join('treino_grupo g', 'tg.grupo_id = g.id')
                ->join('treino_tipo tr', 'tg.treino_id = tr.id')
                ->join('funcionarios f', 'tg.funcionario_id = f.id')
                ->join('cliente c', 'tg.cliente_id = c.id')
                ->where('c.id', $data->cliente_id)
                ->where('tg.status', 'Pendente')
                ->where('tg.id',  $proximoTipoGrupoID)
                ->orderBy('tg.data_criacao', 'ASC') // Ordena pela data de criação mais antiga
                ->groupBy('ct.id');

            $data = $dados->get();

            return $this->response->setJSON($data->getResult())->setStatusCode(200);
        }else{
            return $this->response->setJSON(["msg" => "false"])->setStatusCode(200); 
        }
    }
    //Faz o cadastro na tabela de exercicios
    public function cadexer()
    {

        $json = file_get_contents('php://input');

        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $this->exer->select('*');
        $this->exer->where('exercicio', $data['exercicio']);
        $validarexer = $this->exer->countAllResults();
        if ($validarexer == 0) {
            $this->exer->insert($data);

            $msg = array("msg" => "Exercicio Enviado");

            return $this->response->setJSON($msg)->setStatusCode(200);
        } else {
            $msg = array("msg" => "Exercicio Já Cadastrado");
            return $this->response->setJSON($msg)->setStatusCode(200);
        }
    }
    //Faz o cadastro na tabela de grupos
    public function cadgrupo()
    {

        $json = file_get_contents('php://input');

        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $this->grupo->insert($data);


        $msg = array("msg" => "Grupo Enviado");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }
    //Faz a pesquisa na tabela de tipo
    public function ptipo()
    {
        $json = file_get_contents('php://input');

        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $dados = $this->tipo->select();
        $data = $dados->get();

        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }
    //Faz a pesquisa na tabela de grupo
    public function pgrupo()
    {
        $json = file_get_contents('php://input');

        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $dados = $this->grupo->select();
        $data = $dados->get();

        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }
    //Faz a pesquisa na tabela de exercicios
    public function pexer()
    {
        $json = file_get_contents('php://input');

        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $dados = $this->exer->select();
        $data = $dados->get();

        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }
}
