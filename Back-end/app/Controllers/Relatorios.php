<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\FichaModel;
use App\Models\TipoGrupo;
use Dompdf\Dompdf;
use CodeIgniter\HTTP\ResponseInterface;

class Relatorios extends BaseController
{
    protected $Tipogrupo;
    protected $ficha;
    public function __construct()
    {
        $this->Tipogrupo = new TipoGrupo();
        $this->ficha = new FichaModel();
    }

    public function rEstatistica()
    {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $dados = $this->Tipogrupo->select('
            tipo_grupo.cliente_id,
            COUNT(f.exer_concluido) AS total_exercicios_concluidos,
            SUM(f.carga) AS carga_total_levantada,
            COUNT(DISTINCT tipo_grupo.id) AS total_de_fichas_concluidos,
            MAX(tipo_grupo.data_conclusao) AS ultima_data_conclusao,
            GROUP_CONCAT(DISTINCT tipo_grupo.feedback SEPARATOR "; ") AS feedbacks
        ')
            ->join('ficha f', 'tipo_grupo.id = f.tipo_grupo_id')
            ->where('tipo_grupo.cliente_id', $data['cliente_id'])
            ->where('tipo_grupo.status', 'concluido')
            ->where('f.exer_concluido !=', 'false')
            ->groupBy('tipo_grupo.cliente_id')
            ->get();
            
            $dadoscli = $dados->getRowArray();
            // $dadoscli = $dados->getResult();

            $view = view('Relatorios/relatorio-estatistica', $dadoscli);

            $this->createPdf($view);

        // return $this->response->setJSON($dados->getResult())->setStatusCode(200);
    }


    private function createPdf($html)
    {
        $dompdf = new Dompdf();

        $dompdf->loadHtml($html);

        $dompdf->setPaper('A4', 'portrait');

        $dompdf->render();

        $dompdf->stream("Relatorio_Estatisticas.pdf", ["Attachment" => 0]); // 'Attachment' => 0 para abrir no navegador, 1 para download
    }
}
