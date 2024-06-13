<?php

namespace App\Models;

use CodeIgniter\Model;

class FichaModel extends Model
{
    protected $table = 'ficha'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['data_conclusao','exer_concluido','carga', 'feedback', 'exer_id','cliente_id','tipo_grupo_id']; 
}
