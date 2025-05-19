<?php

namespace App\Models;

use CodeIgniter\Model;

class DespesaModel extends Model
{
    protected $table = 'despesas';
    protected $primaryKey = 'id';
    protected $allowedFields = ['descricao', 'valor', 'tipo', 'data', 'observacao', 'status', 'criado_em'];
}
