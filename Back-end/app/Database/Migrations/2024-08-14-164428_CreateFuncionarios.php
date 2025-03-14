<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateFuncionarios extends Migration
{
    protected $dbb;
    public function up()
    {
        $this->dbb = \Config\Database::connect();
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
            'telefone' => [
                'type' => 'VARCHAR',
                'constraint' => '15', // Tamanho suficiente para números com formato internacional
            ],
            'data_nascimento' => [
                'type' => 'DATE',
            ],
            'CPF' => [
                'type' => 'VARCHAR',
                'constraint' => '14', // Formato XXX.XXX.XXX-XX
                'unique' => true, // Garantir que o CPF seja único
            ],
            'foto' => [
                'type' => 'VARCHAR',
                'constraint' => '255', // Para armazenar o caminho da imagem
                'null' => true, // Foto pode ser opcional
            ],
            'email' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'unique' => true, // Garantir que o email seja único
            ],
            'senha' => [
                'type' => 'VARCHAR',
                'constraint' => '255', // Hash de senha geralmente é longo
            ],
            'funcao' => [
                'type' => 'VARCHAR',
                'constraint' => '50', // Nome do cargo ou função
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

        // Definir chave primária
        $this->forge->addKey('id', true);

        // Criar tabela
        if (!$this->dbb->tableExists('funcionarios')) {
            $this->forge->createTable('funcionarios', true);
        }
    }

    public function down()
    {
        // Remover tabela no rollback
        $this->forge->dropTable('funcionarios');
    }
}
