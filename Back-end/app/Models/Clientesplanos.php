<?php

namespace App\Models;

use CodeIgniter\Model;

class Clientesplanos extends Model
{
    protected $table            = 'clientesplanos';
    protected $primaryKey       = 'id';
    protected $allowedFields    = ['data_inicio','data_vencimento','status','forma_pagamento','cliente_id','plano_id'];
}
