<?php
namespace App\Controllers;

use App\Controllers\BaseController;

use Config\Services;


class EmailController extends BaseController
{

    public function create()
    {
  
        // Dados do usuário (obtidos de um formulário, por exemplo)
        $json = file_get_contents('php://input');

        $data = json_decode($json, true);


        $token = bin2hex(random_bytes(16));

        // Enviar email de confirmação
        $this->enviarEmail($data['email'], $token);
    }

    private function enviarEmail($email, $token)
    {
        $emailService = Services::email();

        $subject = 'Confirmação de Email';
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
            echo 'Email enviado com sucesso.';
            return $this->response->setJSON('Email enviado com sucesso')->setStatusCode(200);
        } else {
            echo $emailService->printDebugger();
        }
    }
}