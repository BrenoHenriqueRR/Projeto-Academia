<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class ExecutarSeeders extends Seeder
{
    public function run()
    {
        $this->call('AcademiaSeeder');
        $this->call('FuncionarioSeeder');
    }
}
