<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\InspectionFormController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\AssignPersonnelController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GetNotificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleFormController;
use App\Http\Controllers\EquipmentController;
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
    Route::get('/getsupervisor/{id}', [UserController::class, 'supervisorNames']);

    //Personnel (For the assignment task)
    Route::get('/getpersonnel/{id}', [AssignPersonnelController::class, 'index']);
    Route::get('/personnel/{id}', [AssignPersonnelController::class, 'getPersonnel']);
    Route::post('/assignpersonnel', [AssignPersonnelController::class, 'storePersonnel']);
    Route::delete('/removepersonnel/{id}', [AssignPersonnelController::class, 'RemovePersonnel']);
    Route::get('/getdriver', [AssignPersonnelController::class, 'getDriver']);

    //Inspection Form
    Route::get('/requestrepair', [InspectionFormController::class, 'index']);
    Route::get('/requestrepair/{id}', [InspectionFormController::class, 'show']);
    Route::get('/requestrepairtwo/{id}', [InspectionFormController::class, 'viewAdmin']);
    Route::get('/requestpairthree/{id}', [InspectionFormController::class, 'InspectorSide']);
    Route::get('/myinspecreq/{id}', [InspectionFormController::class, 'myRequestInspec']); // View My Request Page
    Route::post('/submitrepairformrequest', [InspectionFormController::class, 'store']); // Submit Form on Request Form
    Route::post('/inspectionformrequesttwo/{id}', [InspectionFormController::class, 'storeAdmin']);
    Route::put('/approve/{id}', [InspectionFormController::class, 'updateApprove']);
    Route::put('/disapprove/{id}', [InspectionFormController::class, 'updateDisapprove']);
    Route::put('/admin_approve/{id}', [InspectionFormController::class, 'updateAdminApprove']);
    Route::put('/admin_disapprove/{id}', [InspectionFormController::class, 'updateAdminDisapprove']);
    Route::put('/inspector/{id}', [InspectionFormController::class, 'storeInspectorForm']);
    Route::put('/inspectorpartb/{id}', [InspectionFormController::class, 'InspectorPartB']);
    Route::put('/requestclose/{id}', [InspectionFormController::class, 'closeRequest']);  

    //Facility Form
    Route::get('/facilityform', [FacilityController::class, 'index']);
    Route::get('/facilityform/{id}', [FacilityController::class, 'show']);
    Route::get('/myfacilityformrequest/{id}', [FacilityController::class, 'myRequest']);
    Route::put('/facilityopr/{id}', [FacilityController::class, 'StoreOPRFormGSO']);
    Route::put('/facilityopradmin/{id}', [FacilityController::class, 'StoreOPRFormAdmin']);
    Route::put('/facilityapproval/{id}', [FacilityController::class, 'AdminApproval']);
    Route::put('/facilitydisapproval/{id}', [FacilityController::class, 'AdminDispprove']);
    Route::put('/requestclose/{id}', [FacilityController::class, 'CloseRequest']);
    Route::post('/facilityformrequest', [FacilityController::class, 'store']);

    //Vehicle Slip
    Route::get('/vehicleform', [VehicleFormController::class, 'index']);
    Route::get('/vehicleform/{id}', [VehicleFormController::class, 'show']);
    Route::get('/myvehicleformrequest/{id}', [VehicleFormController::class, 'myRequest']);
    Route::put('/getvehicleslip/{id}', [VehicleFormController::class, 'submitVehicle']);
    Route::put('/vehicleformapprove/{id}', [VehicleFormController::class, 'adminApprove']);
    Route::put('/vehicleformdisapprove/{id}', [VehicleFormController::class, 'adminDisapprove']);
    Route::put('/closevehicleslip/{id}', [VehicleFormController::class, 'closeRequest']);
    Route::post('/vehicleformrequest', [VehicleFormController::class, 'store']);

    //For Equipment Form
    Route::post('/equipmentformrequest', [EquipmentController::class, 'store']);
    Route::get('/myequipmentformrequest/{id}', [EquipmentController::class, 'myRequestEquipment']);
    Route::get('/equipmentform/{id}', [EquipmentController::class, 'show']);
    Route::put('/equipmentsupap/{id}', [EquipmentController::class, 'SupAp']);
    Route::put('/equipmentsupdp/{id}', [EquipmentController::class, 'SupDp']);
    Route::put('/equipmentmanap/{id}', [EquipmentController::class, 'ManAp']);
    Route::put('/equipmentmandp/{id}', [EquipmentController::class, 'ManDp']);
    Route::put('/equipmentmanins/{id}', [EquipmentController::class, 'AdminInstruct']);
    Route::put('/equipmentgsoform/{id}', [EquipmentController::class, 'GSOForm']);
    Route::put('/equipmentgclose/{id}', [EquipmentController::class, 'closeRequest']);

});
Route::middleware(['auth'])->group(function () {
    Route::get('/getuser', [DashboardController::class, 'getCurrentUser']);
});

//New Get Notifications
Route::get('/supnotification', [GetNotificationController::class, 'SupervisorNoti']); 
Route::get('/gsonotification', [GetNotificationController::class, 'GSONoti']); 
Route::get('/adminnotification', [GetNotificationController::class, 'AdminNoti']);
Route::get('/personnelnotification', [GetNotificationController::class, 'PersonnelNoti']);

// Landing Page
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//Test area