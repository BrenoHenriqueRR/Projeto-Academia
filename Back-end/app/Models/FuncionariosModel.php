<?php

namespace App\Models;

use CodeIgniter\Model;

class FuncionariosModel extends Model
{
    protected $table = 'funcionarios'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['nome','data_nascimento','telefone','CPF', 'email', 'senha','funcao','foto','status'];   
 }
    