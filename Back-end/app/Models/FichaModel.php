<?php

namespace App\Models;

use CodeIgniter\Model;

class FichaModel extends Model
{
    protected $table = 'ficha'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['status','data_conclusao','contagem', 'feedback', 'treino_id','cliente_id']; 
}
