<?php

namespace App\Models;

use CodeIgniter\Model;

class PagamentosModel extends Model
{
    protected $table            = 'pagamentos';
    protected $primaryKey       = 'id';
    protected $allowedFields    = ['valor','data_pagamento','data_criacao', 'status_pagamento',
    'forma_pagamento','funcionario_id','cliente_planos_id',
];
}
