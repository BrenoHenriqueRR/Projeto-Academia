<?php

namespace App\Models;

use CodeIgniter\Model;

class ExerciciosModel extends Model
{
    protected $table = 'exercicios'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['exercicio','grupo_muscular_id']; 
}
