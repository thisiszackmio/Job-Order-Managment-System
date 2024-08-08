<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AnnounceController;
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
  // --- Logout --- //
  Route::post('/logout', [AuthController::class, 'logout']);

  // --- Team List --- //
  Route::get('/teams', [AnnounceController::class, 'teamList']);

  // --- Announcement --- //
  Route::post('/addannouncements', [AnnounceController::class, 'storeAnnouncements']);
  Route::put('/editannouncements/{id}', [AnnounceController::class, 'editAnnouncements']);
  Route::delete('/deleteannouncements/{id}', [AnnounceController::class, 'deleteAnnouncements']);
  Route::get('/showannouncements', [AnnounceController::class, 'showAnnouncements']);

  // --- User Employee Details --- //
  Route::post('/register', [AuthController::class, 'register']);
  Route::put('/updatedetail/{id}', [UserController::class, 'updateEmployeeDetail']);
  Route::put('/updatecc/{id}', [UserController::class, 'updateEmployeeCodeClearance']);
  Route::put('/updateaavatar/{id}', [UserController::class, 'updateEmployeeAvatar']);
  Route::put('/updateesig/{id}', [UserController::class, 'updateEmployeeEsig']);
  Route::delete('/deleteuser/{id}', [UserController::class, 'removeEmployee']);
  Route::get('/showusers', [UserController::class, 'showEmployee']);
  Route::get('/userdetail/{id}', [UserController::class, 'employeeDetails']);

});

// --- Login --- //
Route::post('/login', [AuthController::class, 'login']);

// --- Logs --- //
Route::get('/getlogs', [AnnounceController::class, 'dashboardLogs']);

// --- Test --- //
