<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AcademiaSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'nome' => 'Academia Alpha',
                'endereco' => 'Rua 1, 123 - Bairro, Cidade, Estado',
                'telefone' => '(11) 1234-5678',
                'cnpj' => '12.345.678/0001-90',
                'logo' => 'academia_alpha_logo.png',
                'descricao' => 'Uma academia completa com equipamentos modernos.',
                'email' => 'contato@academiaalpha.com',
                'data_criacao' => date('Y-m-d H:i:s'),
                'data_modificacao' => date('Y-m-d H:i:s'),
            ],
            [
                'nome' => 'Academia Beta',
                'endereco' => 'Rua 2, 456 - Bairro, Cidade, Estado',
                'telefone' => '(21) 9876-5432',
                'cnpj' => '98.765.432/0001-21',
                'logo' => 'academia_beta_logo.png',
                'descricao' => 'Academia voltada para treinos de alta intensidade.',
                'email' => 'contato@academiabetes.com',
                'data_criacao' => date('Y-m-d H:i:s'),
                'data_modificacao' => date('Y-m-d H:i:s'),
            ],
        ];

        // Inserir dados na tabela 'academia'
        $this->db->table('academia')->insertBatch($data);
    }
}
