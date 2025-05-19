<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateDespesasTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'          => ['type' => 'INT', 'auto_increment' => true],
            'descricao'   => ['type' => 'VARCHAR', 'constraint' => 100],
            'valor'       => ['type' => 'DECIMAL', 'constraint' => '10,2'],
            'tipo'        => ['type' => 'ENUM', 'constraint' => ['fixa', 'variável']],
            'data'        => ['type' => 'DATE'],
            'observacao'  => ['type' => 'TEXT', 'null' => true],
            'status'      => ['type' => 'ENUM', 'constraint' => ['paga', 'pendente'], 'default' => 'pendente'],
            'data_criacao'   => ['type' => 'DATE'],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('despesas');
    }


    public function down()
    {
       $this->forge->dropTable('despesas');
    }
}
