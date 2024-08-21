<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class FuncionarioSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'nome' => 'João Silva',
                'telefone' => '(11) 99876-5432',
                'data_nascimento' => '1990-05-10',
                'CPF' => '123.456.789-00',
                'foto' => 'joao_silva.png',
                'email' => 'joao@academia.com',
                'senha' => password_hash('senha123', PASSWORD_DEFAULT),  // Hash de senha
                'funcao' => 'Personal Trainer',
                'data_criacao' => date('Y-m-d H:i:s'),
                'data_modificacao' => date('Y-m-d H:i:s'),
            ],
            [
                'nome' => 'Maria Souza',
                'telefone' => '(21) 98765-4321',
                'data_nascimento' => '1985-08-20',
                'CPF' => '987.654.321-00',
                'foto' => 'maria_souza.png',
                'email' => 'maria@academia.com',
                'senha' => password_hash('senha123', PASSWORD_DEFAULT),
                'funcao' => 'Recepcionista',
                'data_criacao' => date('Y-m-d H:i:s'),
                'data_modificacao' => date('Y-m-d H:i:s'),
            ],
        ];

        // Inserir dados na tabela 'funcionarios'
        $this->db->table('funcionarios')->insertBatch($data);
    }
}
