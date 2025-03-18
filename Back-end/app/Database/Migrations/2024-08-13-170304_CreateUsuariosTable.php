<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateClienteTable extends Migration
{
    protected $dbb;
    public function up()
    {
        $this->dbb = \Config\Database::connect();
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'nome' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'datanascimento' => [
                'type'       => 'DATE',
            ],
            'genero' => [
                'type'       => "ENUM('Masculino', 'Feminino', 'Outro')",
                'null'       => false,
            ],
            'CPF' => [
                'type'       => 'VARCHAR',
                'constraint' => '14',
                'unique'     => true,
            ],
            'RG' => [
                'type'       => 'VARCHAR',
                'constraint' => '20',
                'unique'     => true,
                'null'       => true,
            ],
            'telefone' => [
                'type'       => 'VARCHAR',
                'constraint' => '20',
                'null'       => true,
            ],
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'unique'     => true,
            ],
            'usuario' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'unique'     => true,
                'null'       => true,
            ],
            'senha' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'endereco' => [
                'type'       => 'TEXT',
                'null'       => true,
            ],
            'ultimo_login' => [
                'type'       => 'DATETIME',
                'null'       => true,
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['ativo', 'inativo'],
                'default'    => 'ativo',
            ],
            'foto_perfil' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'termo_responsabilidade' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            '   ' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'personal_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
            ],
            'planos_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
            ],
            'created_at' => [
                'type' => 'TIMESTAMP',
                'null' => false,
            ],
            'updated_at' => [
                'type' => 'TIMESTAMP',
                'null' => false,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('personal_id', 'funcionarios', 'id', 'CASCADE', 'SET NULL');
        $this->forge->addForeignKey('planos_id', 'planos', 'id', 'CASCADE', 'SET NULL');
        if (!$this->dbb->tableExists('cliente')) {
            $this->forge->createTable('cliente', true);
        }
    }

    public function down()
    {
        $this->forge->dropTable('cliente');
    }
}
