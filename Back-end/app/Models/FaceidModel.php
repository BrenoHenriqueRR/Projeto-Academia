<?php

namespace App\Models;

use CodeIgniter\Model;

class FaceidModel extends Model
{
    protected $table      = 'selfies_clientes';
    protected $primaryKey = 'id';
    protected $allowedFields = ['cliente_id', 'caminho_imagem'];    
}
