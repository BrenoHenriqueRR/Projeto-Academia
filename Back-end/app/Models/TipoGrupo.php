<?php

namespace App\Models;

use CodeIgniter\Model;

class TipoGrupo extends Model
{
    protected $table = 'tipo_grupo'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['status','feedback', 'treino_id', 'cliente_id','grupo_id', 'funcionario_id', 'data_conclusao','data_criacao']; 
}
