<?php

namespace App\Models;

use CodeIgniter\Model;


class AnamneseModel extends Model
{
    protected $table            = 'anamnese';
    protected $primaryKey       = 'id';
    protected $allowedFields = [
        'cliente_id',
        'perg_problemas_saude',
        'perg_sintomas',
        'perg_medicamentos',
        'perg_historico_familiar_cardiaco',
        'perg_restricao_medica',
        'perg_gravida',
        'perg_fuma',
        'perg_bebe_alcool',
        'perg_exercicio_frequente',
        'perg_qtde_aerobico',
        'perg_colesterol_medido',
        'perg_alimentacao_balanceada',
        'perg_gordura_alta',
        'perg_nivel_estresse',
        'perg_objetivos_saude',
        'anotacoes'
    ];
}
