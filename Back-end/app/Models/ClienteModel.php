<?php 
header('Access-Control-Allow-Origin: http://localhost:4200');
namespace App\Models;

use CodeIgniter\Model;

class ClienteModel extends Model {
    protected $table = 'cliente'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['nome', 'email', 'senha', 'endereco'];
    protected $useTimestamps = true;
    
}
