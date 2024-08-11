<?php

namespace App\Models;

use CodeIgniter\Model;

class Admin extends Model
{
    protected $table = 'funcionarios';
    protected $primaryKey = 'id';
    protected $allowedFields = ['nome','data_nascimento','CPF', 'email', 'senha','funcao'];   
}
