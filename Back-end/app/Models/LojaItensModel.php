<?php

namespace App\Models;

use CodeIgniter\Model;

class LojaItensModel extends Model
{
    protected $table = 'itens_venda';
    protected $primaryKey = 'id';
    protected $allowedFields = ['quantidade','preco_unitario','venda_id', 'produto_id'];   
}
