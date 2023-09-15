<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\InspectionFormController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
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

Route::middleware('auth:sanctum')->group(function(){
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/inspectionformrequest', [InspectionFormController::class, 'store']);
    Route::put('/updateinspectionformrequest/{id}', [InspectionFormController::class, 'update']);

    Route::get('/ppausers', [UserController::class, 'index']);
    Route::get('/getrepair', [DashboardController::class, 'getRepair']);
});
Route::middleware(['auth'])->group(function () {
    Route::get('/getuser', [DashboardController::class, 'getCurrentUser']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
