<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateClientesPlanos extends Migration
{
    protected $dbb;
    public function up()
    {
        $this->dbb = \Config\Database::connect();
        $this->forge->addField([
            'id'            => ['type' => 'INT', 'auto_increment' => true],
            'cliente_id'    => ['type' => 'INT', 'null' => false],
            'plano_id'      => ['type' => 'INT', 'null' => false],
            'data_inicio'   => ['type' => 'DATE', 'null' => false],
            'data_vencimento' => ['type' => 'DATE', 'null' => false],
            'status'        => ['type' => "ENUM('Ativo', 'Pendente', 'Cancelado')", 'default' => 'Ativo'],
            'forma_pagamento' => ['type' => "ENUM('Cartão', 'Boleto', 'Dinheiro', 'Pix')", 'null' => false],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('cliente_id', 'cliente', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('plano_id', 'planos', 'id', 'CASCADE', 'CASCADE');
        if (!$this->dbb->tableExists('clientes_planos')) {
            $this->forge->createTable('clientes_planos', true);
        }
    }

    public function down()
    {
        $this->forge->dropTable('clientes_planos');
    }
}
