<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePlanos extends Migration
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
            'preco' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',  // para valores com duas casas decimais
            ],
            'descricao' => [
                'type' => 'TEXT',
            ],
            'duracao' => [
                'type' => "ENUM('Mensal', 'Trimestral', 'Semestral', 'Anual')", 
                'null' => false
            ],
            'beneficios' => [
                'type' => 'TEXT',
            ],
            'disponibilidade' => [
                'type' => 'ENUM',
                'constraint' => ['ativo', 'inativo'],  // Definindo os valores permitidos
                'default' => 'ativo',  // Valor padrão como 'ativo'
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
        $this->forge->createTable('planos');
    }

    public function down()
    {
        // Removendo a tabela no rollback
        $this->forge->dropTable('planos');
    }
}
