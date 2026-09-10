<?php

use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');

        Route::resource('users', UserController::class)
            ->middlewareFor('index', 'can:users.view')
            ->middlewareFor('show', 'can:users.view')
            ->middlewareFor('store', 'can:users.create')
            ->middlewareFor('edit', 'can:users.update')
            ->middlewareFor('destroy', 'can:users.delete');
    });
