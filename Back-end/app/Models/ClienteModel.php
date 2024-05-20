<?php 
namespace App\Models;

use CodeIgniter\Model;

class ClienteModel extends Model {
    protected $table = 'cliente'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['nome','CPF', 'email', 'senha', 'endereco','datanascimento','personal_id'];   
}
