<?php

namespace App\Models;

use CodeIgniter\Model;

class FichaExerciciosModel extends Model
{
     protected $table = 'ficha_exercicios'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['ficha_id','exercicio_id','repeticoes','series','observacoes']; 
}
