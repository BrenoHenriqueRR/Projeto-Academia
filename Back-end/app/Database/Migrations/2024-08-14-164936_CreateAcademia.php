<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAcademia extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'nome' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'endereco' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
            ],
            'telefone' => [
                'type' => 'VARCHAR',
                'constraint' => '15',
            ],
            'cnpj' => [
                'type' => 'VARCHAR',
                'constraint' => '18', // Para formato CNPJ: XX.XXX.XXX/XXXX-XX
                'unique' => true, // CNPJ deve ser único
            ],
            'logo' => [
                'type' => 'VARCHAR',
                'constraint' => '255', // Caminho da imagem do logo
                'null' => true,
            ],
            'descricao' => [
                'type' => 'TEXT', // Descrição mais longa
                'null' => true,
            ],
            'email' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'unique' => true, // Email deve ser único
            ],
            'data_criacao' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'data_modificacao' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        // Definindo chave primária
        $this->forge->addKey('id', true);

        // Criando a tabela
        $this->forge->createTable('academia');
    }

    public function down()
    {
        // Removendo a tabela no rollback
        $this->forge->dropTable('academia');
    }
}
