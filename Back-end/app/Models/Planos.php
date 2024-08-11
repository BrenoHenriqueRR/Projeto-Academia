<?php

namespace App\Models;

use CodeIgniter\Model;

class Planos extends Model
{
    protected $table  = 'planos';
    protected $primaryKey = 'id';
    protected $allowedFields = ['nome','preco','descricao','duracao','beneficios','disponibilidade', 'data_criacao','data_modificacao'];
}
