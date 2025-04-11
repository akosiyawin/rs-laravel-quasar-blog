<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Blog routes
    Route::apiResource('blogs', \App\Http\Controllers\Api\BlogController::class)->only(['store', 'update', 'destroy','index']);
    Route::patch('blogs/{blog}/status', [\App\Http\Controllers\Api\BlogController::class, 'changeStatus']);
    Route::post('blogs/{blog}/archive', [\App\Http\Controllers\Api\BlogController::class, 'archive']);
    Route::post('blogs/{id}/restore', [\App\Http\Controllers\Api\BlogController::class, 'restore']);
    Route::get('/user/me', [App\Http\Controllers\Api\UserController::class, 'me']);
    Route::get('/blogs/dashboard-stats', [App\Http\Controllers\Api\BlogController::class, 'dashboardStats']);
});
