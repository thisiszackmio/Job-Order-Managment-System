<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\InspectionFormController;
use App\Http\Controllers\AssignPersonnelController;
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

    //Request Inspection Form Part A - Part D
    Route::post('/inspectionformrequest', [InspectionFormController::class, 'store']);
    Route::post('/inspectionformrequesttwo/{id}', [InspectionFormController::class, 'storeAdmin']);
    Route::get('/inspectionformtwo/{id}', [InspectionFormController::class, 'viewAdmin']);
   
    //Get User
    Route::get('/ppausers', [UserController::class, 'index']);

    //Route::get('/getrepair', [DashboardController::class, 'getRepair']);

    //Get Personnel List
    Route::get('/getpersonnel', [AssignPersonnelController::class, 'index']);

    //Display Inpection Request on the site
    Route::get('/requestrepair', [InspectionFormController::class, 'index']);
    Route::get('/requestrepair/{id}', [InspectionFormController::class, 'show']);

    //Supervisor Confirmation
    Route::put('/approve/{id}', [InspectionFormController::class, 'updateApprove']);
    Route::put('/disapprove/{id}', [InspectionFormController::class, 'updateDisapprove']);
});
Route::middleware(['auth'])->group(function () {
    Route::get('/getuser', [DashboardController::class, 'getCurrentUser']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
