<?php

namespace App\Models;

use CodeIgniter\Model;

class Treinoexer extends Model
{
    protected $table = 'execicio'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['exercicio']; 
}
