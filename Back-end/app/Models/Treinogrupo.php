<?php

namespace App\Models;

use CodeIgniter\Model;

class Treinogrupo extends Model
{
    protected $table = 'treino_grupo'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['grupo']; 
}
