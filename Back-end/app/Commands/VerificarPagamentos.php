<?php namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\ClientesPlanos;

class VerificarPagamentos extends BaseCommand
{
    protected $group       = 'Pagamentos';
    protected $name        = 'pagamentos:verificar';
    protected $description = 'Verifica vencimentos de planos e atualiza status dos clientes';

    public function run(array $params)
    {
        $model = new ClientesPlanos();
        $hoje = date('Y-m-d');

        // Planos que já passaram do vencimento e ainda estão pendentes ou ativos
        $planos = $model->where('data_vencimento <', $hoje)
                        ->whereIn('status', ['pendente', 'ativo'])
                        ->findAll();

        foreach ($planos as $plano) {
            $model->update($plano['id'], ['status' => 'atrasado']);
            CLI::write("Plano {$plano['id']} do cliente {$plano['cliente_id']} atualizado para ATRASADO", 'red');
        }

        CLI::write("Verificação concluída em " . $hoje, 'green');
    }
}
