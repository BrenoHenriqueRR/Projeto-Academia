<?php

namespace App\Models;

use CodeIgniter\Model;

class TreinoTipo extends Model
{
    protected $table = 'treino_tipo'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['tipo'];    
}
