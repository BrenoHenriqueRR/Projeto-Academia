<?php

namespace App\Models;

use CodeIgniter\Model;

class TreinoModel extends Model
{
    protected $table = 'treinos2'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['treino_id','grupo_id','exer_id', 'series', 'repeticoes','funcionario_id', 'cliente_id']; 
}
