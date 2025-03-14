<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Anamnese extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'                => ['type' => 'INT', 'auto_increment' => true],
            'cliente_id'        => ['type' => 'INT', 'null' => false],
            'altura'            => ['type' => 'DECIMAL', 'constraint' => '5,2', 'null' => true],
            'peso'              => ['type' => 'DECIMAL', 'constraint' => '5,2', 'null' => true],
            'pressao_arterial'  => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'historico_doencas' => ['type' => 'TEXT', 'null' => true],
            'medicamentos'      => ['type' => 'TEXT', 'null' => true],
            'restricoes_fisicas'=> ['type' => 'TEXT', 'null' => true],
            'objetivo'          => ['type' => "ENUM('Hipertrofia', 'Emagrecimento', 'Condicionamento', 'Outro')", 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('cliente_id', 'cliente', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('anamnese');
    }

    public function down()
    {
        $this->forge->dropTable('anamnese');
    }
}
