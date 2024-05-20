<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
// $routes->get('/', 'Home::index');
// $routes->options((':any'), 'Cliente::options');
// $routes->resource('Cliente');
$routes->post('/Cliente/create', 'Cliente::create');
$routes->post('/Cliente/login', 'Cliente::login');
$routes->get("/Cliente/pesquisar", 'Cliente::pesquisar');
$routes->post("/Cliente/pesquisarid", 'Cliente::pesquisarid');
$routes->get('/Personal/pesquisar', 'Personal::pesquisar');
$routes->post('/Admin/login', 'Admin::login');
$routes->post('/Admin/funcao', 'Admin::funcao');
$routes->post('/Admin/funcaoPncli', 'Admin::funcaoPncli');
$routes->post('/Admin/buscar', 'Admin::buscar');
$routes->post('/Admin/editar', 'Admin::editar');
$routes->post('/Treino/create', 'Treino::create');
$routes->post('/Treino/pesquisar', 'Treino::pesquisar');



