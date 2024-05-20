<?php

namespace App\Models;

use CodeIgniter\Model;

class TreinoModel extends Model
{
    protected $table = 'treinos'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['treino','grupo','exer', 'series', 'repeticoes','funcionario_id', 'cliente_id']; 
}
