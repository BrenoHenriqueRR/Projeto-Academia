<?php

namespace App\Models;

use CodeIgniter\Model;

class AcademiaModel extends Model
{
    protected $table = 'academia'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['nome','endereco','telefone','cnpj','logo','descricao', 'email', 'data_criacao','data_modificacao'];   
}
