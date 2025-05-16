<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class ExerciciosSeeder extends Seeder
{
    public function run()
    {
        // 1. Inserir os grupos musculares
        $grupos = [
            ['id' => 1, 'nome' => 'Peito'],
            ['id' => 2, 'nome' => 'Costas'],
            ['id' => 3, 'nome' => 'Pernas'],
            ['id' => 4, 'nome' => 'Bíceps'],
            ['id' => 5, 'nome' => 'Tríceps'],
            ['id' => 6, 'nome' => 'Ombros'],
            ['id' => 7, 'nome' => 'Abdômen'],
            ['id' => 8, 'nome' => 'Glúteos'],
            ['id' => 9, 'nome' => 'Antebraço'],
            ['id' => 10, 'nome' => 'Panturrilhas'],
        ];

        $this->db->table('grupos_musculares')->insertBatch($grupos);

        // 2. Inserir os exercícios
        $exercicios = [
            // Peito
            ['nome' => 'Supino Reto com Barra', 'grupo_muscular_id' => 1],
            ['nome' => 'Supino Inclinado com Halteres', 'grupo_muscular_id' => 1],
            ['nome' => 'Supino Declinado com Halteres', 'grupo_muscular_id' => 1],
            ['nome' => 'Crucifixo Reto com Halteres', 'grupo_muscular_id' => 1],
            ['nome' => 'Crucifixo Inclinado com Halteres', 'grupo_muscular_id' => 1],
            ['nome' => 'Peck Deck (Fly)', 'grupo_muscular_id' => 1],
            ['nome' => 'Crossover no Cabo', 'grupo_muscular_id' => 1],
            ['nome' => 'Flexão de Braço', 'grupo_muscular_id' => 1],

            // Costas
            ['nome' => 'Puxada Frontal na Polia', 'grupo_muscular_id' => 2],
            ['nome' => 'Remada Curvada com Barra', 'grupo_muscular_id' => 2],
            ['nome' => 'Remada Unilateral com Halteres', 'grupo_muscular_id' => 2],
            ['nome' => 'Remada Baixa na Polia', 'grupo_muscular_id' => 2],
            ['nome' => 'Puxada na Barra Fixa (Pull-up)', 'grupo_muscular_id' => 2],
            ['nome' => 'Remada Cavalinho (T-Bar Row)', 'grupo_muscular_id' => 2],
            ['nome' => 'Levantamento Terra', 'grupo_muscular_id' => 2],

            // Pernas
            ['nome' => 'Agachamento Livre', 'grupo_muscular_id' => 3],
            ['nome' => 'Agachamento no Smith', 'grupo_muscular_id' => 3],
            ['nome' => 'Leg Press 45º', 'grupo_muscular_id' => 3],
            ['nome' => 'Cadeira Extensora', 'grupo_muscular_id' => 3],
            ['nome' => 'Cadeira Flexora', 'grupo_muscular_id' => 3],
            ['nome' => 'Afundo com Halteres', 'grupo_muscular_id' => 3],
            ['nome' => 'Agachamento Búlgaro', 'grupo_muscular_id' => 3],
            ['nome' => 'Stiff com Halteres', 'grupo_muscular_id' => 3],

            // Bíceps
            ['nome' => 'Rosca Direta com Barra', 'grupo_muscular_id' => 4],
            ['nome' => 'Rosca Alternada com Halteres', 'grupo_muscular_id' => 4],
            ['nome' => 'Rosca Scott', 'grupo_muscular_id' => 4],
            ['nome' => 'Rosca Concentrada', 'grupo_muscular_id' => 4],
            ['nome' => 'Rosca Martelo', 'grupo_muscular_id' => 4],
            ['nome' => 'Rosca 21', 'grupo_muscular_id' => 4],

            // Tríceps
            ['nome' => 'Tríceps Testa com Barra W', 'grupo_muscular_id' => 5],
            ['nome' => 'Tríceps Corda no Pulley', 'grupo_muscular_id' => 5],
            ['nome' => 'Tríceps Francês com Halteres', 'grupo_muscular_id' => 5],
            ['nome' => 'Mergulho entre bancos', 'grupo_muscular_id' => 5],
            ['nome' => 'Tríceps Banco com Peso', 'grupo_muscular_id' => 5],
            ['nome' => 'Tríceps na Máquina', 'grupo_muscular_id' => 5],

            // Ombros
            ['nome' => 'Desenvolvimento com Halteres', 'grupo_muscular_id' => 6],
            ['nome' => 'Desenvolvimento com Barra', 'grupo_muscular_id' => 6],
            ['nome' => 'Elevação Lateral com Halteres', 'grupo_muscular_id' => 6],
            ['nome' => 'Elevação Frontal com Halteres', 'grupo_muscular_id' => 6],
            ['nome' => 'Remada Alta com Barra', 'grupo_muscular_id' => 6],
            ['nome' => 'Crucifixo Inverso', 'grupo_muscular_id' => 6],

            // Abdômen
            ['nome' => 'Abdominal Reto no Solo', 'grupo_muscular_id' => 7],
            ['nome' => 'Abdominal Infra com Elevação de Pernas', 'grupo_muscular_id' => 7],
            ['nome' => 'Prancha Isométrica', 'grupo_muscular_id' => 7],
            ['nome' => 'Abdominal na Máquina', 'grupo_muscular_id' => 7],
            ['nome' => 'Abdominal Obliquo com Torção', 'grupo_muscular_id' => 7],
            ['nome' => 'Elevação de Pernas na Barra Fixa', 'grupo_muscular_id' => 7],

            // Glúteos
            ['nome' => 'Elevação de Quadril no Banco', 'grupo_muscular_id' => 8],
            ['nome' => 'Abdução de Quadril na Máquina', 'grupo_muscular_id' => 8],
            ['nome' => 'Glúteo na Polia Baixa', 'grupo_muscular_id' => 8],
            ['nome' => 'Agachamento Sumô', 'grupo_muscular_id' => 8],
            ['nome' => 'Avanço com Passada', 'grupo_muscular_id' => 8],

            // Antebraço
            ['nome' => 'Rosca Inversa com Barra', 'grupo_muscular_id' => 9],
            ['nome' => 'Rosca Punho com Halteres', 'grupo_muscular_id' => 9],
            ['nome' => 'Rosca de Punho Inversa', 'grupo_muscular_id' => 9],

            // Panturrilhas
            ['nome' => 'Elevação de Panturrilha Sentado', 'grupo_muscular_id' => 10],
            ['nome' => 'Elevação de Panturrilha em Pé', 'grupo_muscular_id' => 10],
            ['nome' => 'Panturrilha na Leg Press', 'grupo_muscular_id' => 10],
        ];

        $this->db->table('exercicios')->insertBatch($exercicios);
    }
}
