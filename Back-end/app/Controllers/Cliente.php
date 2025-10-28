<?php

namespace App\Controllers;
date_default_timezone_set('America/Sao_Paulo');

use App\Models\AnamneseModel;
use App\Models\AcademiaModel;
use App\Models\ClienteModel;
use App\Models\Clientesplanos;
use App\Models\PagamentosModel;
use App\Models\Planos;
use App\Models\PresencaclientesModel;
use CodeIgniter\CLI\Console;
use CodeIgniter\Database\Query;
use Dompdf\Dompdf;
use Dompdf\Options;
use DateTime;
use DateInterval;

class Cliente extends BaseController
{
    protected $model;
    protected $ClientesPlanoModel;
    protected $ClientePlanos;
    protected $ClientesPlanoExtraModel;
    protected $academiaModel;
    protected $email;
    protected $anamneseModel;
    protected $pagamentosModel;
    protected $prensencaclientesModel;
    protected $planosModel;


    public function __construct()
    {
        $this->model = new ClienteModel();
        $this->planosModel = new Planos();
        $this->ClientesPlanoModel = new Clientesplanos();
        $this->ClientePlanos = new ClientePlanos();
        $this->model = new ClienteModel();
        $this->email = new EmailController();
        $this->academiaModel = new AcademiaModel();
        $this->anamneseModel = new AnamneseModel();
        $this->pagamentosModel = new PagamentosModel();
        $this->prensencaclientesModel = new PresencaclientesModel();
    }

    public function create()
    {
        // Verificar se já existe um cliente com o mesmo CPF
        $cpf = $this->request->getPost('CPF');

        $clienteExistente = $this->model->where('CPF', $cpf)->first();
        if ($clienteExistente) {
            return $this->response->setJSON([
                'erro' => true,
                'msg' => 'CPF já cadastrado'
            ])->setStatusCode(400);
        }
        $dados = [
            'nome' => $this->request->getPost('nome'),
            'CPF' => $this->request->getPost('CPF'),
            // 'RG' => $this->request->getPost('RG'),
            'telefone' => $this->request->getPost('telefone'),
            'email' => $this->request->getPost('email'),
            'endereco' => $this->request->getPost('endereco'),
            'datanascimento' => $this->request->getPost('datanascimento'),
            'nivel_experiencia	' => $this->request->getPost('nivel_experiencia	'),
            'treino_com_personal' => $this->request->getPost('treino_com_personal'),
            'plano' => $this->request->getPost('plano'),
        ];
        $dados['personal_id'] = null !== $this->request->getPost('personal_id') ? $this->request->getPost('personal_id') : null;
        $foto = $this->request->getFile('foto_perfil');
        $atestado = null !== $this->request->getFile('atestado_medico') ? $this->request->getFile('atestado_medico') : null;
        $termoaut = null !== $this->request->getFile('termo_autorizacao') ? $this->request->getFile('termo_autorizacao') : null;
        $termores = null !== $this->request->getFile('termo_responsabilidade') ? $this->request->getFile('termo_responsabilidade') : null;
        $plano = [
            'plano' => $this->request->getPost('plano'),
            'funcionario_id' => $this->request->getPost('funcionario_id'),
        ];

        $dados['atestado_medico'] = $this->processarArquivo($atestado, 'atestado', $this->request->getPost('CPF'));
        $dados['termo_autorizacao'] = $this->processarArquivo($termoaut, 'termo_autorizacao', $this->request->getPost('CPF'));
        $dados['termo_responsabilidade'] = $this->processarArquivo($termores, 'termo_responsabilidade', $this->request->getPost('CPF'));
        $dados['status'] = 'inativo';

        // Receber os outros dados do formulário

        $this->model->insert($dados);
        $id = $this->model->getInsertID();

        if (!empty($plano)) {
            $this->ClientePlanos->create($plano, $id);
        }

        if (isset($foto)) {
            if ($foto->isValid() && !$foto->hasMoved()) {
                $nomeimg = $foto->getRandomName();

                $caminhoPasta = 'assets/fotos-perfil/' . $id;
                if (!is_dir($caminhoPasta)) {
                    mkdir($caminhoPasta, 0755, true); // cria a pasta se não existir
                }

                $foto->move($caminhoPasta, $nomeimg);
                $caminhoImagem = $caminhoPasta . '/' . $nomeimg;

                // Atualiza o campo de imagem no banco
                $this->model->update($id, ['foto_perfil' => $caminhoImagem]);
            }
        }

        $pin = random_int(100000, 999999);
        $pin_hash = password_hash($pin, PASSWORD_DEFAULT);

        $dados['pin'] = $pin_hash;
        $this->model->update($id, ['pin' => $pin_hash]);

        // Inclui o PIN para o template de e-mail
        $verif_email = array(
            'id' => $id,
            'email' => $dados['email'],
            'pin' => $pin
        );

        $msg = array("msg" => "Cadastro Enviado");

        $this->email->verificaEmail($verif_email);

        return $this->response->setJSON($msg)->setStatusCode(200);
    }

    public function createComplete()
    {
        $clienteJson = $this->request->getPost('cliente');
        $anamneseJson = $this->request->getPost('anamnese');
        $foto = $this->request->getFile('foto_perfil');


        $cliente = json_decode($clienteJson, true);
        $anamnese = json_decode($anamneseJson, true);


        foreach ($anamnese as $key => $value) {
            if (is_array($value)) {
                $anamnese[$key] = implode(', ', $value);
            }
        }

        $cliente['status'] = 'inativo';
        $atestado = null !== $this->request->getFile('atestado_medico') ? $this->request->getFile('atestado_medico') : null;
        $termoaut = null !== $this->request->getFile('termo_autorizacao') ? $this->request->getFile('termo_autorizacao') : null;
        $cliente['atestado_medico'] = $this->processarArquivo($atestado, 'atestado', $cliente['CPF']);
        $cliente['termo_autorizacao'] = $this->processarArquivo($termoaut, 'termo_autorizacao', $cliente['CPF']);

        $this->model->insert($cliente);
        $id = $this->model->getInsertID();

        $cliente['funcionario_id'] = $this->request->getPost('funcionario_id');


        $anamnese['cliente_id'] = $id;

        if (isset($foto)) {
            if ($foto->isValid() && !$foto->hasMoved()) {
                $nomeimg = $foto->getRandomName();

                $caminhoPasta = 'assets/fotos-perfil/' . $id;
                if (!is_dir($caminhoPasta)) {
                    mkdir($caminhoPasta, 0755, true); // cria a pasta se não existir
                }

                $foto->move($caminhoPasta, $nomeimg);
                $caminhoImagem = $caminhoPasta . '/' . $nomeimg;

                // Atualiza o campo de imagem no banco
                $this->model->update($id, ['foto_perfil' => $caminhoImagem]);
            }
        }

        $this->anamneseModel->insert($anamnese);

        $planos = [
            'plano' => $cliente['plano'][0],
            'funcionario_id' => $cliente['funcionario_id']
        ];

        if (!empty($cliente['plano'])) {
            $this->ClientePlanos->create($planos, $id);
        }

        $verif_email = array(
            'id' => $id,
            'email' => $cliente['email']
        );

        $this->email->verificaEmail($verif_email);

        $msg = array("msg" => "Cadastro Enviado");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }

    public function pesquisarPag()
    {
        $dados = $this->pagamentosModel
            ->select('pagamentos.*, cliente.nome AS nome_cliente, planos.nome AS nome_plano, clientes_planos.data_vencimento')
            ->join('clientes_planos', 'clientes_planos.id = pagamentos.cliente_planos_id')
            ->join('cliente', 'cliente.id = clientes_planos.cliente_id')
            ->join('planos', 'planos.id = clientes_planos.plano_id')
            ->findAll();

        return $this->response->setJSON($dados)->setStatusCode(200);
    }

    public function delete()
    {

        $json = file_get_contents('php://input');

        // Decodificar o JSON em um array PHP
        $data = json_decode($json, true);

        $this->model->set([
            'status' => 'anulado'
        ])
            ->where('id', $data['id'])
            ->update();

        $msg = array("msg" => "Cliente deletado");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }

    public function login()
    {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $logindate = date("Y-m-d");
        $senhahash = hash('sha256', $data['senha']);


        if ($data && isset($data['email']) && isset($data['senha'])) {
            $this->model->where('email', $data['email']);
            $this->model->where('senha', $senhahash);
            $query = $this->model->get();

            if ($query->getResult()) {
                $result = $query->getRow();
                if ($result) {
                    $msg = array([
                        "msg" => "true",
                        "id" => $result->id
                    ]);
                }
                // O email e a senha existem no banco de dados
                $this->model->where('email', $data['email'])
                    ->where('senha', $senhahash)
                    ->set([
                        'ultimo_login' => $logindate,
                    ])
                    ->update();
                return $this->response->setJSON($msg)->setStatusCode(200);
            } else {
                // O email e/ou a senha não existem
                $msg = array(["msg" => "false"]);
                return $this->response->setJSON($msg)->setStatusCode(200);
            }
        } else {
            //dados ausentes ou inválidos
            $msg = array("msg" => "Erro nos dados enviados");
            return $this->response->setJSON($msg)->setStatusCode(200);
        }
    }

    public function verificarEmail($id)
    {
        $usuario = $this->model->where('id', $id)->first();
        if (!$usuario) {
            return $this->response->setJSON(['success' => false, 'message' => 'Token inválido.']);
        }

        $this->model->update($id, ['email_verificado' => 1]);

        return $this->response->setJSON(['success' => true, 'msg' => 'E-mail verificado!']);
    }

    public function criarSenha()
    {

        $dados = $this->request->getJSON();


        $result = $this->model->update($dados->id, ['senha' => hash('sha256', $dados->senha)]);

        if ($result) {
            return $this->response->setJSON(['success' => true, 'msg' => 'Senha verificada com sucesso!']);
        } else {
            return $this->response->setJSON(['success' => false, 'msg' => 'Ocorreu um erro!! Tente novamente']);
        }
    }

    public function pesquisar()
    {
        $dados = $this->model->select('c.*, p.nome AS nome_personal, p.id as id_func')
            ->from('cliente AS c')
            ->join('funcionarios AS p', 'c.personal_id = p.id', 'LEFT')
            ->groupBy('c.id');
        // $dados = $this->model->select('*');

        $data = $dados->get();

        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }
    public function pesquisarpid()
    {
        $data = $this->request->getJSON();

        $dados = $this->model
            ->select('c.*, p.id as funcionario_id, p.nome AS nome_personal')
            ->from('cliente AS c')
            ->join('funcionarios AS p', 'c.personal_id = p.id', 'LEFT')
            ->where('c.id', $data->id)
            ->groupBy('c.id');

        $data = $dados->get();


        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }
    public function pesquisarid()
    {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $dados = $this->model->select('id')
            ->where('email', $data['email']);

        $data = $dados->get();

        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }

    public function inserirFoto()
    {
        //apagar imagem anterior do usuário
        $file = $this->request->getFile('foto');
        $id = $this->request->getPost('id');

        $dados = $this->model->select('foto_perfil')
            ->where('id', $id);
        $query = $dados->get();
        if (isset($query)) {
            foreach ($query->getResult() as $row) {
                if (!empty($row->foto_perfil)) {
                    unlink($row->foto_perfil);
                }
            }
        }

        // inserir imagem de perfil do usuário
        if ($file->isValid() && !$file->hasMoved()) {
            $nomeimg = $file->getRandomName(); //gera um nome aleatorio a foto
            $file->move('assets/fotos-perfil/' . $id, $nomeimg); // move a imagem para a pasta
            $caminhoImagem = 'assets/fotos-perfil/' . $id . '/' . $nomeimg;
            $this->model->where('id', $id)
                ->set([
                    'foto_perfil' => $caminhoImagem
                ])
                ->update();
            $msg = array("msg" => "Foto de perfil alterada com sucesso!!");
            return $this->response->setJSON($msg)->setStatusCode(200);
        } else {
            $msg = array("msg" => "Ocorreu um erro ao alterar a foto, tente novamente!");
            return $this->response->setJSON($msg)->setStatusCode(200);
        }
    }

    public function pegarFoto()
    {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $dados = $this->model->select('foto_perfil')
            ->where('id', $data['id']);

        $data = $dados->get();

        return $this->response->setJSON($data->getResult())->setStatusCode(200);
    }

    public function trocarSenha()
    {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $this->model->where('email', $data['email'])
            ->set([
                "senha" => $data['senha']
            ])
            ->update();

        $msg = array("msg" => "Senha alterada com sucesso !!");

        return $this->response->setJSON($msg)->setStatusCode(200);
    }

    public function processarArquivo($arquivo, $tipo, $cpf)
    {
        if ($arquivo != null && $arquivo->isValid() && !$arquivo->hasMoved()) {
            $nomearq = $arquivo->getRandomName();
            $diretorio = 'assets/' . $tipo . '/' . $cpf;
            $arquivo->move($diretorio, $nomearq);
            return $diretorio . '/' . $nomearq;
        }
        return null;
    }

    public function getClientesSemAnamnese()
    {

        $dados = $this->model->select('cliente.id, cliente.nome')
            ->join('anamnese', 'cliente.id = anamnese.cliente_id', 'left')
            ->where('anamnese.id', null)
            ->findAll();

        return $this->response->setJSON($dados)->setStatusCode(200);
    }

    public function relatorioClientesStatus()
    {
        // Instancia os models necessários
        $clienteModel = new ClienteModel();
        $academiaModel = new AcademiaModel();

        $academia = $academiaModel->first();
        if (!$academia) {
            die('Erro: Dados da academia não encontrados.');
        }

        $dadosView = [
            'clientes_ativos'   => $clienteModel->where('status', 'ativo')->findAll(),
            'clientes_inativos' => $clienteModel->where('status', 'inativo')->findAll(),
            'clientes_anulados' => $clienteModel->where('status', 'anulado')->findAll(),

            'nome_academia'     => $academia['nome'],
            'cnpj_academia'     => $academia['cnpj'],
            'email_academia'    => $academia['email'],
            'logo_academia'     => $academia['logo'],
            'telefone_academia' => $academia['telefone'],
            'gerado_em'         => date('d/m/Y H:i:s')
        ];

        $html = view('relatorios/relatorio_clientes_status', $dadosView);

        $options = new Options();
        // $options->set('defaultFont', 'DejaVu Sans');
        $options->set('isRemoteEnabled', true); // Mudei para false
        $options->set('isHtml5ParserEnabled', true);
        $options->set('enable_font_subsetting', true);
        $options->set('debugKeepTemp', false);
        $options->set('debugCss', false);
        $options->set('debugLayout', false);
        $options->set('debugLayoutLines', false);
        $options->set('debugLayoutBlocks', false);
        $options->set('debugLayoutInline', false);
        $options->set('debugLayoutPaddingBox', false);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        // Baixar o PDF diretamente
        $nomeArquivo = 'relatorio-financeiro-' . 'relatorio_clientes_status' . '.pdf';

        return $this->response
            ->setHeader('Content-Type', 'application/pdf')
            ->setHeader('Content-Disposition', 'inline; filename="' . $nomeArquivo . '"')
            ->setBody($dompdf->output());
    }

    public function relatorioFinanceiroClientes()
    {
        $db = \Config\Database::connect();

        // $dataInicio = $this->request->getGet('data_inicio');
        // $dataFim = $this->request->getGet('data_fim');

        // if ($dataInicio && $dataFim) {
        //     $dataInicio .= ' 00:00:00';
        //     $dataFim .= ' 23:59:59';
        // }

        $sql = "
        SELECT 
            c.id AS cliente_id,
            c.nome AS cliente_nome,
            c.email AS cliente_email,
            p.nome AS plano_nome,
            pg.valor AS valor_pago,
            pg.forma_pagamento,
            pg.status_pagamento,
            pg.data_pagamento
        FROM pagamentos as pg
        JOIN clientes_planos cp ON cp.id = pg.cliente_planos_id
        JOIN cliente c ON c.id = cp.cliente_id
        JOIN planos p ON p.id = cp.plano_id
        WHERE 1=1
    ";

        // if ($dataInicio && $dataFim) {
        //     $sql .= " AND pg.data_pagamento BETWEEN '$dataInicio' AND '$dataFim'";
        // }

        $sql .= " ORDER BY c.nome ASC, pg.data_pagamento DESC";

        $result = $db->query($sql)->getResultArray();

        // Agrupar por cliente
        $clientes = [];
        foreach ($result as $row) {
            $clientes[$row['cliente_id']]['nome'] = $row['cliente_nome'];
            $clientes[$row['cliente_id']]['email'] = $row['cliente_email'];
            $clientes[$row['cliente_id']]['pagamentos'][] = [
                'plano_nome'       => $row['plano_nome'],
                'valor_pago'       => $row['valor_pago'],
                'forma_pagamento'  => $row['forma_pagamento'],
                'status_pagamento' => $row['status_pagamento'],
                'data_pagamento'   => $row['data_pagamento'],
            ];
        }

        // Totais gerais
        $totalGeral = array_sum(array_map(fn($r) => $r['valor_pago'], $result));

        $academiaModel = new \App\Models\AcademiaModel();
        $academia = $academiaModel->first();

        $dadosView = [
            'clientes'      => $clientes,
            'total_geral'   => $totalGeral,
            // 'data_inicio'   => $dataInicio ? date('d/m/Y', strtotime($dataInicio)) : '---',
            // 'data_fim'      => $dataFim ? date('d/m/Y', strtotime($dataFim)) : '---',
            'nome_academia' => $academia['nome'] ?? '---',
            'logo_academia' => $academia['logo'] ?? '',
            'cnpj_academia' => $academia['cnpj'] ?? '',
            'email_academia' => $academia['email'] ?? '',
            'telefone_academia' => $academia['telefone'] ?? '',
            'gerado_em'     => date('d/m/Y H:i:s')
        ];

        $html = view('relatorios/relatorio_financeiro_clientes', $dadosView);

        $options = new \Dompdf\Options();
        $options->set('isRemoteEnabled', true);
        $options->set('isHtml5ParserEnabled', true);
        $dompdf = new \Dompdf\Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $nomeArquivo = 'relatorio_financeiro_clientes_' . date('Ymd_His') . '.pdf';

        return $this->response
            ->setHeader('Content-Type', 'application/pdf')
            ->setHeader('Content-Disposition', 'inline; filename="' . $nomeArquivo . '"')
            ->setBody($dompdf->output());
    }

    public function buscarCliPin($pin)
    {
        //pin teste : 015245
        $pin = hash('sha256', $pin);
        $cliente = $this->model->where('pin', $pin)->first();


        if ($cliente) {
            return ['cliente_id' => $cliente['id'], 'status' => 'sucesso'];
        } else {
            return false;
        }
    }

    public function registrarPresenca()
    {
        $request = $this->request->getJSON(true);

        $cliente_id = $request['cliente_id'] ?? null;
        $metodo = $request['metodo'] ?? null;
        $pin = $request['pin'] ?? null;

        if (!empty($pin)) {
            $resultado = $this->buscarCliPin($pin);

            if ($resultado) {
                $cliente_id = $resultado;
            }else{
                return $this->response->setJSON([
                    'status' => 'erro',
                    'msg' => 'PIN inválido.'
                ]);
            }
        }

        if (!$metodo) {
            return $this->response->setJSON([
                'status' => 'erro',
                'msg' => 'Dados insuficientes para registrar presença.'
            ]);
        }

        // buscar cliente
        $cliente = $this->model->find($cliente_id);
        if (!$cliente) {
            return $this->response->setJSON([
                'status' => 'erro',
                'msg' => 'Cliente não encontrado.'
            ]);
        }

        $status = 'erro';
        $observacao = '';

        if ($metodo === 'faceid') {
            // faceID validado anteriormente via AWS Rekognition
            $status = 'sucesso';
            $observacao = 'Reconhecimento facial bem-sucedido.';
        } elseif ($metodo === 'pin') {
            if (!$pin) {
                return $this->response->setJSON([
                    'status' => 'erro',
                    'msg' => 'PIN não informado.'
                ]);
            }

            //  Valida PIN
            if ($result = $this->buscarCliPin($pin)) {
                $cliente_id = $result['cliente_id'];
                $status = 'sucesso';
                $observacao = 'Presença registrada via PIN.';
            } else {
                $observacao = 'PIN incorreto.';
            }
        } else {
            return $this->response->setJSON([
                'status' => 'erro',
                'msg' => 'Método de autenticação inválido.'
            ]);
        }

        $hoje = date('Y-m-d');

        // Verifica se já existe presença hoje sem hora_saida
        $presencaAberta = $this->prensencaclientesModel
            ->where('cliente_id', $cliente_id)
            ->where('DATE(hora_entrada)', $hoje)
            ->where('hora_saida', null)
            ->first();

        if ($presencaAberta) {
            // Atualiza hora_saida
            $this->prensencaclientesModel->update($presencaAberta['id'], [
                'hora_saida' => date('Y-m-d H:i:s'),
                'observacao' => $observacao
            ]);

            return $this->response->setJSON([
                'status' => $status,
                'msg' => 'Saída registrada com sucesso!'
            ]);
        } else {
            // Cria novo registro de entrada
            $dados = [
                'cliente_id' => $cliente_id,
                'metodo_autenticacao' => $metodo,
                'status' => $status,
                'hora_entrada' => date('Y-m-d H:i:s'),
                'observacao' => $observacao
            ];

            $this->prensencaclientesModel->insert($dados);

            return $this->response->setJSON([
                'status' => $status,
                'msg' => 'Entrada registrada com sucesso!'
            ]);
        }


    }       

     public function gerarRelatorioPresenca()
    {
        $dataInicio = $this->request->getGet('data_inicio');
        $dataFim = $this->request->getGet('data_fim');

        

        if (!$dataInicio || !$dataFim) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'As datas de início e fim são obrigatórias.'
            ]);
        }

        $model = new PresencaClientesModel();

        $presencas = $model
            ->select('presenca_clientes.*, cliente.nome AS cliente_nome')
            ->join('cliente', 'cliente.id = presenca_clientes.cliente_id')
            ->where('DATE(data) >=', $dataInicio)
            ->where('DATE(data) <=', $dataFim)
            ->orderBy('data', 'ASC')
            ->findAll();

        $resumo = [
            'total' => count($presencas),
            'sucesso' => count(array_filter($presencas, fn($p) => $p['status'] === 'sucesso')),
            'erro' => count(array_filter($presencas, fn($p) => $p['status'] === 'erro')),
            'faceid' => count(array_filter($presencas, fn($p) => $p['metodo_autenticacao'] === 'faceid')),
            'pin' => count(array_filter($presencas, fn($p) => $p['metodo_autenticacao'] === 'pin')),
            'clientes_unicos' => count(array_unique(array_column($presencas, 'cliente_id'))),
        ];

        // Taxas
        $resumo['taxa_sucesso'] = $resumo['total'] > 0 ? round(($resumo['sucesso'] / $resumo['total']) * 100, 1) : 0;
        $resumo['taxa_erro'] = $resumo['total'] > 0 ? round(($resumo['erro'] / $resumo['total']) * 100, 1) : 0;

         $academiaInfo = $this->academiaModel->first() ?? [
            'nome' => 'Nome da Academia Padrão',
            'cnpj' => '00.000.000/0000-00',
            'email' => 'contato@academia.com',
            'logo' => 'assets/img/logo_padrao.png',
            'telefone' => '(00) 00000-0000'
        ];
        // Dados para a view
        $dados = [
            'logo_academia' =>  $academiaInfo['logo'],
            'nome_academia' => $academiaInfo['nome'],
            'cnpj_academia' => $academiaInfo['cnpj'],
            'email_academia' => $academiaInfo['email'],
            'telefone_academia' => $academiaInfo['telefone'],
            'nome_mes' => $this->formataMes($dataInicio, $dataFim),
            'ano' => date('Y', strtotime($dataInicio)),
            'gerado_em' => date('d/m/Y H:i'),
            'resumo' => $resumo,
            'presencas' => $presencas,
            'periodo' => [
                'inicio' => date('d/m/Y', strtotime($dataInicio)),
                'fim' => date('d/m/Y', strtotime($dataFim))
            ]
        ];

        // 📄 Renderizar o HTML da view
        $html = view('relatorios/relatorio_presenca', $dados);

      $options = new Options();
        $options->set('isRemoteEnabled', true);
        $options->set('isHtml5ParserEnabled', true);
        $options->set('defaultFont', 'Arial');
        $options->set('chroot', FCPATH . 'public');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $nomeArquivo = 'relatorio-Pagamentos-' . date('Ymd-His') . '.pdf';
        return $this->response
            ->setHeader('Content-Type', 'application/pdf')
            ->setHeader('Content-Disposition', 'inline; filename="' . $nomeArquivo . '"')
            ->setBody($dompdf->output());
        //return $pdf->stream($nomeArquivo, ["Attachment" => true]);
    }

    /**
     * Função auxiliar para formatar o nome do mês/intervalo no cabeçalho do relatório
     */
    private function formataMes($inicio, $fim)
    {
        $mesInicio = date('m', strtotime($inicio));
        $mesFim = date('m', strtotime($fim));

        $meses = [
            '01' => 'Janeiro', '02' => 'Fevereiro', '03' => 'Março',
            '04' => 'Abril', '05' => 'Maio', '06' => 'Junho',
            '07' => 'Julho', '08' => 'Agosto', '09' => 'Setembro',
            '10' => 'Outubro', '11' => 'Novembro', '12' => 'Dezembro'
        ];

        if ($mesInicio === $mesFim) {
            return $meses[$mesInicio];
        }

        return $meses[$mesInicio] . ' - ' . $meses[$mesFim];
    }

    public function gerarRelatorioPresencaIndividual()
    {
        $cliente_id = $this->request->getVar('cliente_id');
        $dataInicio = $this->request->getVar('data_inicio');
        $dataFim = $this->request->getVar('data_fim');

        if (!$cliente_id || !$dataInicio || !$dataFim) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'É necessário informar o cliente, data de início e data de fim.'
            ]);
        }

        $presencaModel = new PresencaClientesModel();

        // 🔹 Busca presenças no período
        $presencas = $presencaModel
            ->select('presenca_clientes.*, cliente.nome as cliente_nome')
            ->join('cliente', 'cliente.id = presenca_clientes.cliente_id')
            ->where('presenca_clientes.cliente_id', $cliente_id)
            ->where('DATE(data) >=', $dataInicio)
            ->where('DATE(data) <=', $dataFim)
            ->orderBy('data', 'ASC')
            ->findAll();

        if (empty($presencas)) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Nenhum registro de presença encontrado para o período informado.'
            ]);
        }

        // 🔹 Busca o plano ativo do cliente
        $planoCliente = $this->ClientesPlanoModel
            ->where('cliente_id', $cliente_id)
            ->where('status', 'ativo')
            ->orderBy('data_inicio', 'DESC')
            ->first();

        $planoNome = 'Não informado';
        $diasPlano = 0;
        if ($planoCliente) {
            $plano = $this->planosModel->find($planoCliente['plano_id']);
            $planoNome = $plano['nome'] ?? 'Plano sem nome';
            $diasPlano = $plano['dias_por_semana'] ?? 0; // campo que você pode adicionar, ex: 3 dias/semana
        }

        // 🧮 Cálculos de presença e tempo
        $diasCompareceu = count(array_unique(array_map(fn($p) => date('Y-m-d', strtotime($p['data'])), $presencas)));
     $totalMinutos = 0;
        foreach ($presencas as $p) {
            if ($p['hora_entrada'] && $p['hora_saida']) {
                $entrada = new DateTime($p['hora_entrada']);
                $saida = new DateTime($p['hora_saida']);
                $totalMinutos += ($saida->getTimestamp() - $entrada->getTimestamp()) / 60;
            }
        }

        $tempoTotalHoras = floor($totalMinutos / 60);
        $tempoTotalMin = $totalMinutos % 60;
        $tempoMedio = $diasCompareceu > 0 ? floor(($totalMinutos / $diasCompareceu) / 60) : 0;

        // 🔹 Calcula percentual de comparecimento baseado no plano
        $semanas = ceil((strtotime($dataFim) - strtotime($dataInicio)) / (7 * 24 * 60 * 60));
        $diasEsperados = $diasPlano * $semanas;
        $percentualComparecimento = $diasEsperados > 0 ? ($diasCompareceu / $diasEsperados) * 100 : 0;

        $dados = [
            'cliente' => $presencas[0]['cliente_nome'],
            'periodo' => [
                'inicio' => date('d/m/Y', strtotime($dataInicio)),
                'fim' => date('d/m/Y', strtotime($dataFim))
            ],
            'plano' => [
                'nome' => $planoNome,
                'dias_semana' => $diasPlano,
                'esperado' => $diasEsperados,
                'compareceu' => $diasCompareceu,
                'percentual' => $percentualComparecimento
            ],
            'resumo' => [
                'tempo_total' => sprintf('%dh %02dm', $tempoTotalHoras, $tempoTotalMin),
                'tempo_medio' => $tempoMedio . 'h/dia'
            ],
            'presencas' => $presencas,
            'gerado_em' => date('d/m/Y H:i')
        ];
        

        $html = view('relatorios/relatorio_presenca_individual', $dados);

        $pdf = new Dompdf(['isHtml5ParserEnabled' => true, 'isRemoteEnabled' => true]);
        $pdf->loadHtml($html);
        $pdf->setPaper('A4', 'portrait');
        $pdf->render();

        return $pdf->stream('Relatorio_Presenca_' . $dados['cliente'] . '.pdf', ["Attachment" => true]);
    }
}
