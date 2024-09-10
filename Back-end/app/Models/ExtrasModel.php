<?php

namespace App\Models;

use CodeIgniter\Model;

class ExtrasModel extends Model
{
    protected $table = 'extras'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['nome','preco', 'status','plano_id', 'descricao']; 
}
