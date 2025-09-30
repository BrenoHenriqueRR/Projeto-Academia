<?php

namespace App\Models;

use CodeIgniter\Model;

class FichaModel extends Model
{
    protected $table = 'fichas'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['cliente_id','tipo','ordem','concluida','status','data_criacao','data_modificado','data_vencimento']; 
}
