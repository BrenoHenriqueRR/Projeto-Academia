<?php

namespace App\Models;

use CodeIgniter\Model;

class FichaModel extends Model
{
    protected $table = 'ficha'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['status','data_conclusao','treinos_concluido','carga', 'feedback', 'treino_id','cliente_id','tipo_idw']; 
}
