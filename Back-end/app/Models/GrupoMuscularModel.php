<?php

namespace App\Models;

use CodeIgniter\Model;

class GrupoMuscularModel extends Model
{
    protected $table = 'grupo_muscular'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['id', 'nome']; 
}
