<?php

namespace App\Models;

use CodeIgniter\Model;

class BeneficiosModel extends Model
{
    protected $table            = 'beneficios_plano';
    protected $primaryKey       = 'id';
    protected $allowedFields    = ['plano_id','descricao'];
}