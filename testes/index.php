<?php
$senha = "ssssss";
$senha_hashed = hash('sha256', $senha);

echo $senha_hashed;

?>