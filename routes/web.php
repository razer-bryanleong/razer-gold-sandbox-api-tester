<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('payment_tester');
});

Route::get('/payment-tester', function () {
    return view('payment_tester');
});

Route::get('/result', [App\Http\Controllers\RazerPaymentController::class, 'returnUrl']);
Route::post('/send-payment-proxy', [App\Http\Controllers\RazerPaymentController::class, 'sendPaymentProxy']);
