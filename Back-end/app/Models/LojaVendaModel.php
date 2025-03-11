<?php

namespace App\Models;

use CodeIgniter\Model;

class LojaVendaModel extends Model
{
    protected $table            = 'loja_vendas';
    protected $primaryKey       = 'id';
    protected $allowedFields    = ['data_venda','total'];
}
