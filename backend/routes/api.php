<?php

use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\OrderController;
use Illuminate\Support\Facades\Route;

// Public, unauthenticated endpoints hit straight from the landing page in the
// browser. Both are throttled per IP so the order form can't be flooded — the
// checkout draft is called repeatedly as the visitor types, so it gets a looser
// budget than the one-shot order submit.
Route::post('/orders', [OrderController::class, 'store'])
    ->middleware('throttle:15,1');

Route::post('/checkouts', [CheckoutController::class, 'store'])
    ->middleware('throttle:60,1');
