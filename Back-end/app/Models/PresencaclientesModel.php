<?php

namespace App\Models;

use CodeIgniter\Model;

class PresencaclientesModel extends Model
{
    protected $table            = 'presencaclientes';
    protected $primaryKey       = 'id';
    protected $allowedFields    = ['cliente_id', 'data', 'hora_entrada', 'hora_saida', 'status', 'metodo_autenticacao', 'observacao'];
}
