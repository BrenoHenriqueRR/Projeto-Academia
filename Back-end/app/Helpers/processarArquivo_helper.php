<?php

if (!function_exists('processarArquivo')) {
    
    function processarArquivo($arquivo, $tipo, $cpf)
    {
        if ($arquivo != null && $arquivo->isValid() && !$arquivo->hasMoved()) {
            $nomearq = $arquivo->getRandomName();
            $diretorio = 'assets/' . $tipo . '/' . $cpf;
            $arquivo->move($diretorio, $nomearq);
            return $diretorio . '/' . $nomearq;
        }
        return null;
    }
}