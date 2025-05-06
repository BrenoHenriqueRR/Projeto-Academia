<?php

namespace App\Models;

use CodeIgniter\Model;

class Clientesplanos extends Model
{
    protected $table            = 'clientes_planos';
    protected $primaryKey       = 'id';
    protected $allowedFields    = ['data_inicio','data_vencimento','status','cliente_id','plano_id'];
}
