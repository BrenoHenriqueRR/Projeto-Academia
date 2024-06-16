<?php

namespace App\Models;

use CodeIgniter\Model;

class FinanceiroModel extends Model
{
    protected $table = 'pagamentos';
    protected $primaryKey = 'id';
    protected $allowedFields = ['valor', 'data_pagamento', 'data_criacao','status_pagamento','Tipo_id','funcionario_id','cliente_id']; 
}
