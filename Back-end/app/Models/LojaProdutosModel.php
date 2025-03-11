<?php

namespace App\Models;

use CodeIgniter\Model;

class LojaProdutosModel extends Model
{
    protected $table            = 'loja_produtos';
    protected $primaryKey       = 'id';
    protected $allowedFields    = ['nome','preco','quantidade','status'];
}
