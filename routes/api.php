<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\InspectionFormController;
use App\Http\Controllers\AssignPersonnelController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GetNotificationController;
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
    Route::get('/inspectionformtwo', [InspectionFormController::class, 'AdminInspectView']);
   
    //Get User
    Route::get('/ppausers', [UserController::class, 'index']);

    //Route::get('/getrepair', [DashboardController::class, 'getRepair']);

    //Get Personnel List
    //Route::get('/getpersonnel', [AssignPersonnelController::class, 'index']);

    //Display Inpection Request on the site
    Route::get('/myinspecreq/{id}', [InspectionFormController::class, 'myRequestInspec']);
    Route::get('/requestrepair', [InspectionFormController::class, 'index']);
    Route::get('/requestrepair/{id}', [InspectionFormController::class, 'show']);

    //Supervisor Approval
    Route::put('/approve/{id}', [InspectionFormController::class, 'updateApprove']);
    Route::put('/disapprove/{id}', [InspectionFormController::class, 'updateDisapprove']);

    //Admin Approval
    Route::put('/admin_approve/{id}', [InspectionFormController::class, 'updateAdminApprove']);
    Route::put('/admin_disapprove/{id}', [InspectionFormController::class, 'updateAdminDisapprove']);

    //Inspector
    Route::post('/inspector/{id}', [InspectionFormController::class, 'storeInspectorForm']);
    Route::get('/inspectorparta/{id}', [InspectionFormController::class, 'InspectorPartA']);
    Route::put('/inspectorpartb/{id}', [InspectionFormController::class, 'InspectorPartB']);     

});
Route::middleware(['auth'])->group(function () {
    Route::get('/getuser', [DashboardController::class, 'getCurrentUser']);
});
// Get Notifications
Route::get('/getnotification', [GetNotificationController::class, 'index']);
Route::put('/setstatus/{id}', [GetNotificationController::class, 'changeStatus']);

// Landing Page
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/getpersonnel', [AssignPersonnelController::class, 'index']);
Route::get('/getpersonnel/{id}', [AssignPersonnelController::class, 'showPersonnel']);
Route::get('/personnel/{id}', [AssignPersonnelController::class, 'getPersonnel']);
