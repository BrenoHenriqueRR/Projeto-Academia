<?php

namespace App\Models;

use CodeIgniter\Model;

class PlanosFrequenciaModel extends Model
{
    protected $table  = 'planos_frequencia';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'plano_id',
        'frequencia_dias_semana',
        'preco'
    ];
}
