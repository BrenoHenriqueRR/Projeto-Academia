<?php

namespace App\Models;

use CodeIgniter\Model;

class TreinoModel extends Model
{
    protected $table = 'cad_treino'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['exer_id', 'series', 'repeticoes','tipo_grupo_id']; 
}
