<?php

namespace App\Models;

use CodeIgniter\Model;

class ClientePlanosExtra extends Model
{
    protected $table = 'cliente_planos_extras'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['clientes_planos_id','extra_id']; 
}
