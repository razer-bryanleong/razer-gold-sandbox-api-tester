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
Route::get('/pin-query-tester', function () {
    return view('pin_query_tester');
});
Route::get('/send-pin-query-proxy', [App\Http\Controllers\RazerPaymentController::class, 'sendPinQueryProxy']);

Route::get('/payment-query-tester', function () {
    return view('payment_query_tester');
});

Route::get('/proxy-payment-query', [App\Http\Controllers\RazerPaymentController::class, 'sendPaymentQueryProxy']);
Route::post('/generate-signature', [App\Http\Controllers\RazerPaymentController::class, 'generateSignature']);
