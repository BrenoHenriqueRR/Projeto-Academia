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



