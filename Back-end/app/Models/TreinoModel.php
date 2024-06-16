<?php

namespace App\Models;

use CodeIgniter\Model;

class TreinoModel extends Model
{
    protected $table = 'cad_treino';
    protected $primaryKey = 'id';
    protected $allowedFields = ['exer_id', 'series', 'repeticoes','tipo_grupo_id']; 
}
