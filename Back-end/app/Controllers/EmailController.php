<?php
namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\ClienteModel;
use Config\Services;


class EmailController extends BaseController
{
    protected $model;

    public function __construct()
    {
        $this->model = new ClienteModel();
    }
    public function create()
    {
  
        // Dados do usuário (obtidos de um formulário, por exemplo)
        $json = file_get_contents('php://input');

        $data = json_decode($json, true);

        $this->model->select('*');
        $this->model->where('email', $data['email']);
        $validaremail = $this->model->countAllResults(); // traz a quantidade de resultados da consulta
        
        if ($validaremail != 0)
        {
            $token = bin2hex(random_bytes(16));

            // Enviar email de confirmação
            $response = $this->enviarEmail($data['email'], $token);

            return $response;
        }else{
            $dados = array(
                'msg' => 'Email não cadastrado',
            );
            return $this->response->setJSON($dados)->setStatusCode(200);
        }
    }

    private function enviarEmail($email, $token)
    {
        $emailService = Services::email();

        $subject = 'Código de Verificação para Redefinição de Senha';
        // $confirmationLink = site_url("confirm/{$token}");]
        $senha = bin2hex(random_bytes(4));

        $data = [
            'senha' => $senha
        ];

        $message = view('confirmar_email', $data);

        $emailService->setTo($email);
        $emailService->setSubject($subject);
        $emailService->setMessage($message);

        if ($emailService->send()) {
            $dados = array(
                'msg' => 'Email enviado com sucesso',
                'senha' => $senha,
            );
            return $this->response->setJSON($dados)->setStatusCode(200);
        } else {
            echo $emailService->printDebugger();
            return $this->response->setJSON('Erro ao enviar o email, Tente novamente!!')->setStatusCode(200);
        }
    }

    public function verificaEmail($data){
        $emailService = Services::email();

        $subject = 'Codigo de verificação do seu email';
        // $confirmationLink = site_url("confirm/{$token}");]


        $message = view('verificar_email', $data);

        $emailService->setTo($data['email']);
        $emailService->setSubject($subject);
        $emailService->setMessage($message);    

        if(!$emailService->send()){
            print_r("Erro ao enviar mensagem");
        }
    }
       
}