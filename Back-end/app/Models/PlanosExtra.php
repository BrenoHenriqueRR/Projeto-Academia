<?php

namespace App\Models;

use CodeIgniter\Model;

class PlanosExtra extends Model
{
    protected $table = 'planos_extras'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['plano_id','extra_id']; 
}
