<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\FichaModel;
use App\Models\TipoGrupo;
use CodeIgniter\HTTP\ResponseInterface;

class Ficha extends BaseController
{
    protected $model;
    protected $tipogrupo;

    public function __construct()
    {
        $this->model = new FichaModel();
        $this->tipogrupo = new TipoGrupo();
    }

    public function create()
    {
        $json = file_get_contents('php://input');

        $data = json_decode($json, true);

        for ($i = 0; $i < count($data); $i++) {
            if ($data[$i]['exer_concluido'] != 0) {
                $data[$i]['exer_concluido'] = 'true';
            } else {
                $data[$i]['exer_concluido'] = 'false';
            }
        }

        foreach($data as $dados){
        $inserirFicha = [
            'exer_concluido' => $dados['exer_concluido'],
            'cliente_id' => $dados['cliente_id'],
            'carga' => $dados['carga'],
            'exer_id' => $dados['exer_id'],
            'tipo_grupo_id' => $dados['tipo_grupo_id'],
        ];
            $this->model->insert($inserirFicha);
        }

        $id = [
            'id' => $data[0]['tipo_grupo_id'],
        ];

        $this->tipogrupo->where('id',$id)
                ->set([
                    'feedback' => $data[0]['feedback'],
                     'data_conclusao' => date('Y/m/d') ,
                     'status' => 'concluido',
                ])
                ->update();
        $msg = array("msg" => "Cadastro Enviado");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }

}
