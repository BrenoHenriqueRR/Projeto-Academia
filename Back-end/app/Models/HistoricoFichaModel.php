<?php

namespace App\Models;

use CodeIgniter\Model;

class HistoricoFichaModel extends Model
{
    protected $table            = 'historico_fichas';
    protected $primaryKey       = 'id';
    protected $allowedFields    = ['cliente_id','ficha_id','tipo','ordem','data_conclusao',]; 
}
