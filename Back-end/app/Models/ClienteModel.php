<?php 
namespace App\Models;

use CodeIgniter\Model;

class ClienteModel extends Model {
    protected $table = 'cliente'; // Nome da tabela no banco de dados
    protected $primaryKey = 'id'; // Chave primária da tabela
    protected $allowedFields = ['nome','CPF', 'email', 'telefone' ,'senha', 'endereco','datanascimento','personal_id','ultimo_login','status','foto_perfil','nivel_experiencia','treino_com_personal','email_verificado']; 
}
