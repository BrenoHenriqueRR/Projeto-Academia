<?php
header('Access-Control-Allow-Origin: http://localhost:4200');
namespace App\Controllers;

class Cliente extends BaseController
{
    public function create()
    {
        $model = new \App\Models\ClienteModel();

        $data = [
            'nome'     => $this->request->getVar('nome'),
            'email'    => $this->request->getVar('email'),
            'senha'    => $this->request->getVar('senha'),
            'endereco' => $this->request->getVar('endereco'),
        ];

        $model->insert($data);
        $msg = "Deu certo";
        echo $msg;
    }
}

?>
