<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// =====================
// CLIENTE
// =====================
$routes->group('Cliente', function ($routes) {
    $routes->post('create', 'Cliente::create');
    $routes->post('createComplete', 'Cliente::createComplete');
    $routes->post('delete', 'Cliente::delete');
    $routes->post('login', 'Cliente::login');
    $routes->get('pesquisar', 'Cliente::pesquisar');
    $routes->get('pesquisarPag', 'Cliente::pesquisarPag');
    $routes->get('getClientesSemAnamnese', 'Cliente::getClientesSemAnamnese');
    $routes->get('verificarEmail/(:num)', 'Cliente::verificarEmail/$1');
    $routes->post('pesquisarid', 'Cliente::pesquisarid');
    $routes->post('criarSenha', 'Cliente::criarSenha');
    $routes->post('pesquisarpid', 'Cliente::pesquisarpid');
    $routes->post('inserirFoto', 'Cliente::inserirFoto');
    $routes->post('pegarFoto', 'Cliente::pegarFoto');
    $routes->post('trocarSenha', 'Cliente::trocarSenha');
    $routes->get('relatorioClientesStatus', 'Cliente::relatorioClientesStatus');
});

// =====================
// CLIENTE PLANOS
// =====================
$routes->group('ClientePlanos', function ($routes) {
 $routes->post('pesquisarId', 'ClientePlanos::pesquisarId');
 $routes->post('concluirPagamento', 'ClientePlanos::concluirPagamento');
});
// =====================
// FUNCIONÁRIOS
// =====================
$routes->group('Funcionarios', function ($routes) {
    $routes->get('pesquisar', 'Funcionarios::pesquisar');
    $routes->post('create', 'Funcionarios::create');
});

// =====================
// ADMINISTRAÇÃO
// =====================
$routes->group('Admin', function ($routes) {
    $routes->post('login', 'Admin::login');
    $routes->post('funcao', 'Admin::funcao');
    $routes->post('funcaoPncli', 'Admin::funcaoPncli');
    $routes->post('buscar', 'Admin::buscar');
    $routes->post('editar', 'Admin::editar');
    $routes->get('buscarfun', 'Admin::buscarfun');
    $routes->post('deletefun', 'Admin::deletefun');
    $routes->post('buscarfuncionario', 'Admin::buscarfuncionario');
    $routes->post('editfuncionario', 'Admin::editfuncionario');
});

// =====================
// TREINO
// =====================
$routes->group('Treino', function ($routes) {
    $routes->post('create', 'Treino::create');
    $routes->post('pesquisar', 'Treino::pesquisar');
    $routes->post('cadgrupo', 'Treino::cadgrupo');
    $routes->post('cadexer', 'Treino::cadexer');
    $routes->get('ptipo', 'Treino::ptipo');
    $routes->get('pgrupo', 'Treino::pgrupo');
    $routes->get('pexer', 'Treino::pexer');
});

// =====================
// FICHA DE TREINO
// =====================
$routes->post('/Ficha/create', 'Ficha::create');
$routes->post('/Ficha/update', 'Ficha::update');
$routes->post('/Ficha/pesquisarCli', 'Ficha::pesquisarCli');
$routes->post('/Ficha/pesquisarFicha', 'Ficha::pesquisarFicha');
$routes->post('/Ficha/fichaNaoConcluida', 'Ficha::fichaNaoConcluida');
$routes->post('/Ficha/concluirFicha', 'Ficha::concluirFicha');
$routes->post('/Ficha/imprimirFichaId', 'Ficha::imprimirFichaId');

// =====================
// FINANCEIRO
// =====================
$routes->group('Financeiro', function ($routes) {
    $routes->post('create', 'Financeiro::create');
    $routes->post('pesquisar', 'Financeiro::pesquisar');
    $routes->get('pesquisarCliPendente', 'Financeiro::pesquisarCliPendente');
    $routes->post('update', 'Financeiro::update');
    $routes->get('resumo', 'Financeiro::resumo');
    $routes->get('listaPagamentos', 'Financeiro::listaPagamentos');
    $routes->get('listaDespesas', 'Financeiro::listaDespesas');
    $routes->get('listaVendas', 'Financeiro::listaVendas');
    $routes->get('pesquisarCliPendente', 'Financeiro::pesquisarCliPendente');
    $routes->get('getEstatisticasComparativas', 'Financeiro::getEstatisticasComparativas');
    $routes->post('pesquisarPagamentosCliente', 'Financeiro::pesquisarCliPendente');
    $routes->get('gerarRelatorioMensalPdf', 'Financeiro::gerarRelatorioMensalPdf');
    $routes->get('vendasLojaDetalhadoPdf', 'Financeiro::vendasLojaDetalhadoPdf');
    $routes->get('relatorioPagamentosStatus', 'Financeiro::relatorioPagamentosStatus');
});

// =====================
// EMAIL
// =====================
$routes->post('/EmailController/create', 'EmailController::create');

// =====================
// RELATÓRIOS
// =====================
$routes->post('/Relatorios/rEstatistica', 'Relatorios::rEstatistica');
$routes->get('/Relatorios/financeiro', 'Relatorios::relatorioPdf');

// =====================
// ACADEMIA
// =====================
$routes->group('Academia', function ($routes) {
    $routes->post('create', 'Academia::create');
    $routes->post('nextStep', 'Academia::nextStep');
    $routes->get('read', 'Academia::read');
    $routes->get('readAcademia', 'Academia::readAcademia');
});

// =====================
// PLANOS
// =====================
$routes->group('Planos', function ($routes) {
    $routes->post('create', 'Planos::create');
    $routes->get('read', 'Planos::read');
    $routes->get('readId/(:num)', 'Planos::readId/$1');
    $routes->post('edit', 'Planos::edit');
    $routes->post('delete', 'Planos::delete');
});

// =====================
// EXTRAS
// =====================
$routes->group('Extras', function ($routes) {
    $routes->post('create', 'Extras::create');
    $routes->get('read', 'Extras::read');
    $routes->post('edit', 'Extras::edit');
    $routes->post('delete', 'Extras::delete');
});

// =====================
// RECONHECIMENTO FACIAL
// =====================
$routes->group('Faceid', function ($routes) {
    $routes->post('create', 'Faceid::create');
    $routes->post('verificarFaceId', 'Faceid::verificarFaceId');
});

// =====================
// LOJA DE PRODUTOS
// =====================
$routes->group('Loja', function ($routes) {
    $routes->post('create', 'Loja::create');
    $routes->post('editProduto', 'Loja::editProduto');
    $routes->post('createSale', 'Loja::createSale');
    $routes->post('deleteProduto', 'Loja::deleteProduto');
    $routes->get('read', 'Loja::read');
    $routes->get('getVendas', 'Loja::getVendas');
    $routes->get('getVendasData', 'Loja::getVendasData');
});

// =====================
// ANAMNESE
// =====================
$routes->group('Anamnese', function ($routes) {
    $routes->post('create', 'Anamnese::create');
    $routes->post('delete', 'Anamnese::delete');
    $routes->post('update', 'Anamnese::update');
    $routes->get('read', 'Anamnese::read');
    $routes->post('readId', 'Anamnese::readId');
    $routes->post('readIdCliente', 'Anamnese::readIdCliente');
});

// =====================
// DESPESAS
// =====================
$routes->group('Despesas', function ($routes) {
    $routes->post('create', 'Despesas::create');
    $routes->post('delete', 'Despesas::delete');
    $routes->post('update', 'Despesas::update');
    $routes->get('read', 'Despesas::read');
    $routes->post('readId', 'Despesas::readId');
});

// =====================
// PAGAMENTOS (STRIPE)
// =====================
$routes->group('StripeController', function ($routes) {
    $routes->get('getPagamentos', 'StripeController::getPagamentos');
    $routes->get('checkout', 'StripeController::checkout');
    $routes->post('gerarPagamento', 'StripeController::gerarPagamento');
    $routes->get('success', 'StripeController::success');
    $routes->get('cancel', 'StripeController::cancel');
});


