<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\InspectionFormController;
use App\Http\Controllers\FacilityFormController;
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

    //Get User Details
    Route::get('/ppausers', [UserController::class, 'index']);
    Route::get('/users', [UserController::class, 'allUser']);
    Route::get('/users/{id}', [UserController::class, 'SpecificUser']);
    Route::put('/changecc/{id}', [UserController::class, 'UpdateCodeClearance']);
    Route::put('/changepwd/{id}', [UserController::class, 'updatePassword']);
    Route::put('/changesg/{id}', [UserController::class, 'updateSignature']);

    //Personnel (For the assignment task)
    Route::get('/getpersonnel', [AssignPersonnelController::class, 'index']);
    Route::get('/getpersonnel/{id}', [AssignPersonnelController::class, 'showPersonnel']);
    Route::get('/personnel/{id}', [AssignPersonnelController::class, 'getPersonnel']);
    Route::post('/assignpersonnel', [AssignPersonnelController::class, 'storePersonnel']);
    Route::delete('/removepersonnel/{id}', [AssignPersonnelController::class, 'RemovePersonnel']);

    //Inspection Form
    Route::get('/inspectiondetails', [InspectionFormController::class, 'getInspectionDetailsAuth']);
    Route::get('/inspectiondetails/{id}', [InspectionFormController::class, 'getInspectionDetails']);
    Route::get('/inspectionformtwo/{id}', [InspectionFormController::class, 'viewAdmin']);
    Route::get('/inspectionadmin', [InspectionFormController::class, 'getInspectionDetailAdmin']);
    Route::get('/inspectionformtwo', [InspectionFormController::class, 'AdminInspectView']);
    Route::get('/myinspecreq/{id}', [InspectionFormController::class, 'myRequestInspec']);
    Route::get('/requestrepair', [InspectionFormController::class, 'index']);
    Route::get('/requestrepair/{id}', [InspectionFormController::class, 'show']);
    Route::get('/inspectorparta/{id}', [InspectionFormController::class, 'InspectorPartA']);
    Route::put('/inspectorpartb/{id}', [InspectionFormController::class, 'InspectorPartB']);
    Route::post('/inspectionformrequest', [InspectionFormController::class, 'store']); //Part A
    Route::post('/inspectionformrequesttwo/{id}', [InspectionFormController::class, 'storeAdmin']); //Part B
    Route::put('/approve/{id}', [InspectionFormController::class, 'updateApprove']);
    Route::put('/disapprove/{id}', [InspectionFormController::class, 'updateDisapprove']);
    Route::put('/admin_approve/{id}', [InspectionFormController::class, 'updateAdminApprove']);
    Route::put('/admin_disapprove/{id}', [InspectionFormController::class, 'updateAdminDisapprove']);
    Route::put('/inspector/{id}', [InspectionFormController::class, 'storeInspectorForm']);
    Route::put('/requestclose/{id}', [InspectionFormController::class, 'closeRequest']);     

    //For Facility Form
    Route::get('/myfacilityformrequest/{id}', [FacilityFormController::class, 'myRequest']);
    Route::get('/facilityformrequest/{id}', [FacilityFormController::class, 'show']);
    Route::get('/facilitymphrequest/{id}', [FacilityFormController::class, 'showMPH']);
    Route::get('/getconferencefacilityform/{id}', [FacilityFormController::class, 'showConference']);
    Route::get('/getdormfacilityform/{id}', [FacilityFormController::class, 'showDorm']);
    Route::post('/facilityformrequest', [FacilityFormController::class, 'store']);
    Route::post('/mphfacilityform/{id}', [FacilityFormController::class, 'storeMPH']);
    Route::post('/conferencefacilityform/{id}', [FacilityFormController::class, 'storeConference']);
    Route::post('/dormfacilityform/{id}', [FacilityFormController::class, 'storeDorm']);
    Route::put('/saveoprinstruction/{id}', [FacilityFormController::class, 'StoreOPRInstruction']);
    Route::put('/saveopraction/{id}', [FacilityFormController::class, 'StoreOPRAction']);
    Route::put('/facilityapproval/{id}', [FacilityFormController::class, 'AdminApproval']);
    Route::put('/facilitydisapproval/{id}', [FacilityFormController::class, 'AdminDispprove']);

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
// Route::put('/saveoprinstruction/{id}', [FacilityFormController::class, 'StoreOPRInstruction']);

// wALAY LABOT
//Route::get('/getrepair', [DashboardController::class, 'getRepair']);
//Get Personnel List
//Route::get('/getpersonnel', [AssignPersonnelController::class, 'index']);


