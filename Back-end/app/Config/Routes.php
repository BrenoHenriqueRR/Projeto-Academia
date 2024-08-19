<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
// $routes->get('/', 'Home::index');
// $routes->options((':any'), 'Cliente::options');
// $routes->resource('Cliente');
$routes->post('/Cliente/create', 'Cliente::create');
$routes->post('/Cliente/delete', 'Cliente::delete');
$routes->post('/Cliente/login', 'Cliente::login');
$routes->get("/Cliente/pesquisar", 'Cliente::pesquisar');
$routes->post("/Cliente/pesquisarid", 'Cliente::pesquisarid');
$routes->post("/Cliente/pesquisarpid", 'Cliente::pesquisarpid');
$routes->post("/Cliente/inserirFoto", 'Cliente::inserirFoto');
$routes->post("/Cliente/pegarFoto", 'Cliente::pegarFoto');
$routes->post("/Cliente/trocarSenha", 'Cliente::trocarSenha');
$routes->get('/Funcionarios/pesquisar', 'Funcionarios::pesquisar');
$routes->post('/Funcionarios/create', 'Funcionarios::create');
$routes->post('/Admin/login', 'Admin::login');
$routes->post('/Admin/funcao', 'Admin::funcao');
$routes->post('/Admin/funcaoPncli', 'Admin::funcaoPncli');
$routes->post('/Admin/buscar', 'Admin::buscar');
$routes->post('/Admin/editar', 'Admin::editar');
$routes->get('/Admin/buscarfun', 'Admin::buscarfun');
$routes->post('/Admin/deletefun', 'Admin::deletefun');
$routes->post('/Admin/buscarfuncionario', 'Admin::buscarfuncionario');
$routes->post('/Admin/editfuncionario', 'Admin::editfuncionario');
$routes->post('/Treino/create', 'Treino::create');
$routes->post('/Treino/pesquisar', 'Treino::pesquisar');
$routes->post('/Treino/cadgrupo', 'Treino::cadgrupo');
$routes->post('/Treino/cadexer', 'Treino::cadexer');
$routes->get('/Treino/ptipo', 'Treino::ptipo');
$routes->get('/Treino/pgrupo', 'Treino::pgrupo');
$routes->get('/Treino/pexer', 'Treino::pexer');
$routes->post('/Ficha/create', 'Ficha::create');
$routes->post('/Financeiro/create', 'Financeiro::create');
$routes->post('/Financeiro/pesquisar', 'Financeiro::pesquisar');
$routes->get('/Financeiro/pesquisarCliPendente', 'Financeiro::pesquisarCliPendente');
$routes->post('/Financeiro/update', 'Financeiro::update');
$routes->post('/EmailController/create', 'EmailController::create');
$routes->get('/StripeController/getPagamentos', 'StripeController::getPagamentos');
$routes->post('/Relatorios/rEstatistica', 'Relatorios::rEstatistica');
$routes->post('/Academia/create', 'Academia::create'); 
$routes->post('/Academia/nextStep', 'Academia::nextStep'); 
$routes->get('/Academia/read', 'Academia::read'); 
$routes->post('/Planos/create', 'Planos::create');
$routes->get('/Planos/read', 'Planos::read');
$routes->post('/Planos/edit', 'Planos::edit');
$routes->post('/Planos/delete', 'Planos::delete');



