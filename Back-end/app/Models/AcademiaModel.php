<?php

namespace App\Models;

use CodeIgniter\Model;

class AcademiaModel extends Model
{
    protected $table = 'academia';
    protected $primaryKey = 'id';   
    protected $allowedFields = ['nome','endereco','telefone','cnpj','logo','descricao','horario_funcionamento','nome_dono','cpf_dono', 'email', 'data_criacao','data_modificacao'];   
}
