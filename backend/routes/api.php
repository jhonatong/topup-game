<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentCallbackController;
use App\Http\Controllers\PaymentSimulatorController;
use App\Http\Controllers\AdminCategoryController;
use App\Http\Controllers\AdminProductController;
use App\Http\Controllers\AdminTransactionController;

/*
|--------------------------------------------------------------------------
| API Routes - BertigaaaTopUp
|--------------------------------------------------------------------------
*/

// Public Catalog & Orders Routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

Route::post('/check-id', [OrderController::class, 'checkId']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{invoice_number}', [OrderController::class, 'show']);

Route::post('/webhook/payment', [PaymentCallbackController::class, 'webhook']);
Route::post('/simulator/pay', [PaymentSimulatorController::class, 'simulatePayment']);

// Admin Management Routes
Route::prefix('admin')->group(function () {
    Route::post('/categories', [AdminCategoryController::class, 'store']);
    Route::put('/categories/{id}', [AdminCategoryController::class, 'update']);
    Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);

    Route::post('/products', [AdminProductController::class, 'store']);
    Route::put('/products/{id}', [AdminProductController::class, 'update']);
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);

    Route::get('/transactions', [AdminTransactionController::class, 'index']);
});
