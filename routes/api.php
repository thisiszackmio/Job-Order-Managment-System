<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AnnounceController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\InspectionController;
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
  Route::get('/getsupervisor', [UserController::class, 'getSupervisor']);

  // --- Assign Personnel --- //
  Route::post('/assignpersonnel', [UserController::class, 'storePersonnel']); // Assign Personnel
  Route::delete('/removepersonnel/{id}', [UserController::class, 'removePersonnel']); // Remove personnel on list
  Route::get('/showpersonnel', [UserController::class, 'showPersonnel']); // Show personnel Detail on Personnel Page
  Route::get('/getpersonnel', [UserController::class, 'getPersonnel']); // Select personnel during assignment
  Route::get('/displaypersonnel/{id}', [UserController::class, 'displayPersonnel']); // Display personnel on select tag on Part B

  // --- JOMS (My Request) --- //
  Route::get('/jomsmyrequest/{id}', [UserController::class, 'GetMyInspRequestJOMS']); /// Show my Request

  // --- JOMS Inspection Request --- //
  Route::post('/submitinsprequest', [InspectionController::class, 'storeInspectionRequest']); // Submit the Request on Part A
  Route::put('/supinsprequestapprove/{id}', [InspectionController::class, 'approveSupervisor']); // Supervisor Approval
  Route::put('/supinsprequestdisapprove/{id}', [InspectionController::class, 'disapproveSupervisor']); // Supervisor Disapproval
  Route::put('/admininsprequestapprove/{id}', [InspectionController::class, 'approveAdmin']); // Admin Approval
  Route::put('/updateinsprequestparta/{id}', [InspectionController::class, 'updatePartA']); // Update Part A Form
  Route::put('/updateinsprequestpartb/{id}', [InspectionController::class, 'updatePartB']); // Update Part B Form
  Route::put('/updateinsprequestpartc/{id}', [InspectionController::class, 'updatePartC']); // Update Part C Form
  Route::put('/updateinsprequestpartd/{id}', [InspectionController::class, 'updatePartD']); // Update Part D Form
  Route::put('/submitinsprequestpartb/{id}', [InspectionController::class, 'submitPartB']); // Submit Part B Form
  Route::put('/submitinsprequestpartc/{id}', [InspectionController::class, 'submitPartC']); // Submit Part C Form
  Route::put('/submitinsprequestpartd/{id}', [InspectionController::class, 'submitPartD']); // Submit Part D Form
  Route::put('/closeinspectionrequest/{id}', [InspectionController::class, 'closeRequest']); // Close the Form
  Route::put('/closeinspectionforce/{id}', [InspectionController::class, 'closeRequestForce']); // Force close the Form
  Route::get('/showinsprequest/{id}', [InspectionController::class, 'showInspectionForm']); // Show Inspection Form Details

});

// --- Login --- //
Route::post('/login', [AuthController::class, 'login']);

// --- Logs --- //
Route::get('/getlogs', [AnnounceController::class, 'dashboardLogs']);

// --- Test --- //