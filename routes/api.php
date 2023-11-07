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

    //Fetch Data on Inspection Form
    Route::get('/inspectiondetails', [InspectionFormController::class, 'getInspectionDetailsAuth']);
    Route::get('/inspectiondetails/{id}', [InspectionFormController::class, 'getInspectionDetails']);
    Route::get('/inspectionformtwo/{id}', [InspectionFormController::class, 'viewAdmin']);
    Route::get('/inspectionadmin', [InspectionFormController::class, 'getInspectionDetailAdmin']);
    
    //Store Inspection Request
    Route::post('/inspectionformrequest', [InspectionFormController::class, 'store']); //Part A
    Route::post('/inspectionformrequesttwo/{id}', [InspectionFormController::class, 'storeAdmin']); //Part B

    //Request Inspection Form Part A - Part D
    Route::get('/inspectionformtwo', [InspectionFormController::class, 'AdminInspectView']);
   
    //Get User
    Route::get('/ppausers', [UserController::class, 'index']);
    Route::get('/users', [UserController::class, 'allUser']);
    Route::get('/users/{id}', [UserController::class, 'SpecificUser']);
    Route::put('/changecc/{id}', [UserController::class, 'UpdateCodeClearance']);
    Route::put('/changepwd/{id}', [UserController::class, 'updatePassword']);
    Route::put('/changesg/{id}', [UserController::class, 'updateSignature']);

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
    Route::put('/inspector/{id}', [InspectionFormController::class, 'storeInspectorForm']);
    Route::get('/inspectorparta/{id}', [InspectionFormController::class, 'InspectorPartA']);
    Route::put('/inspectorpartb/{id}', [InspectionFormController::class, 'InspectorPartB']);
    Route::put('/requestclose/{id}', [InspectionFormController::class, 'closeRequest']);     

    //Personnel
    Route::get('/getpersonnel', [AssignPersonnelController::class, 'index']);
    Route::get('/getpersonnel/{id}', [AssignPersonnelController::class, 'showPersonnel']);
    Route::get('/personnel/{id}', [AssignPersonnelController::class, 'getPersonnel']);
    Route::post('/assignpersonnel', [AssignPersonnelController::class, 'storePersonnel']);
    Route::delete('/removepersonnel/{id}', [AssignPersonnelController::class, 'RemovePersonnel']);

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

//Test area


// wALAY LABOT
//Route::get('/getrepair', [DashboardController::class, 'getRepair']);
//Get Personnel List
//Route::get('/getpersonnel', [AssignPersonnelController::class, 'index']);


