<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Anamnese extends Migration
{
    protected $dbb;
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true
            ],
            'cliente_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true
            ],
            'perg_problemas_saude' => [
                'type' => 'TEXT',
                'null' => true
            ],
            'perg_sintomas' => [
                'type' => 'TEXT',
                'null' => true
            ],
            'perg_medicamentos' => [
                'type' => 'TEXT',
                'null' => true
            ],
            'perg_historico_familiar_cardiaco' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'null'       => false,
                'default'    => 0
            ],
            'perg_restricao_medica' => [
                'type' => 'TEXT',
                'null' => true
            ],
            'perg_gravida' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'null'       => false,
                'default'    => 0
            ],
            'perg_fuma' => [
                'type' => 'VARCHAR',
                'constraint' => 250,
                'null' => true
            ],
            'perg_bebe_alcool' => [
                'type' => 'VARCHAR',
                'constraint' => 250,
                'null' => true
            ],
            'perg_exercicio_frequente' => [
                'type' => 'VARCHAR',
                'constraint' => 250,
                'null' => true
            ],
            'perg_qtde_aerobico' => [
                'type' => 'INT',
                'constraint' => 11,
                'null' => true
            ],
            'perg_colesterol_medido' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'null'       => false,
                'default'    => 0
            ],
            'perg_alimentacao_balanceada' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'null'       => false,
                'default'    => 0
            ],
            'perg_gordura_alta' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'null'       => false,
                'default'    => 0
            ],
            'perg_peso_mm' => [
                'type' => 'VARCHAR',
                'constraint' => 250,
                'null' => true
            ],
            'perg_nivel_estresse' => [
                'type' => "ENUM('leve', 'moderado', 'elevado', 'constante')",
                'null' => false,
                'default' => 'leve'
            ],
            'perg_objetivos_saude' => [
                'type' => 'VARCHAR',
                'constraint' => 250,
                'null' => true
            ],
            'anotacoes' => [
                'type' => 'TEXT',
                'null' => true
            ],
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
