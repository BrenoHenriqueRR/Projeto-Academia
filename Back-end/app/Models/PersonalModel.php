<?php

namespace App\Models;

use CodeIgniter\Model;

class PersonalModel extends Model
{
    protected $table = 'personal'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['Nome','datanascimento','cpf', 'email', 'senha'];   
 }
    