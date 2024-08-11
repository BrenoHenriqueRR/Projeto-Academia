<?php

namespace App\Models;

use CodeIgniter\Model;

class Progressoconfig extends Model
{
    protected $table = 'progresso_configuracao';
    protected $primaryKey = 'id';
    protected $allowedFields = ['etapa_atual','data_ultima_atualizacao'];
}
