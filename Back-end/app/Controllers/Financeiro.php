<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\FinanceiroModel;
use CodeIgniter\HTTP\ResponseInterface;

class Financeiro extends BaseController
{
    protected $model; 

    public function __construct(){
        $this->model = new FinanceiroModel();
    }

    public function create()
    {

        $json = file_get_contents('php://input');
    
        $data = json_decode($json, true);

        
    }
}
