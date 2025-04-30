<?php

namespace App\Models;

use CodeIgniter\Model;

class LojaItensModel extends Model
{
    protected $table = 'loja_vendas_itens';
    protected $primaryKey = 'id';
    protected $allowedFields = ['quantidade','valor_unitario','venda_id', 'produto_id'];   
}
