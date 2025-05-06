<?php

namespace App\Models;

use CodeIgniter\Model;

class ClientePlanosExtra extends Model
{
    protected $table = 'clientes_planos_extra'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['clientes_planos_id','extra_id']; 
}
