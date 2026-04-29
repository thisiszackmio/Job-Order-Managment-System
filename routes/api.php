<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AnnounceController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\FacilityVenueController;
use App\Http\Controllers\VehicleSlipController;
use App\Http\Controllers\JOMSDashboardController;
use App\Http\Controllers\LogsController;
use App\Http\Controllers\ServerStatusController;
use App\Http\Controllers\LocatorSlipController;
use App\Http\Controllers\TravelDetailController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\LogsModel;

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

  // --- Maintenance Mode --- //
  Route::get('/settings/maintenance', function() {
    $mode = DB::table('superadminsettings')->where('key_name', 'maintenance_mode')->value('key_value');
    return response()->json(['maintenance' => $mode === 'on']);
  });
  Route::post('/settings/maintenance/update', function(Request $request) {
    $mode = $request->input('mode');
    DB::table('superadminsettings')->updateOrInsert(
      ['key_name' => 'maintenance_mode'],
      ['key_value' => $mode]
    );

    // Logs
    $logs = new LogsModel();
    $logs->category = 'SYSTEM';
    $logs->message = 'Maintenance mode ' . ($mode === 'on' ? 'activated.' : 'deactivated.');
    $logs->save();

    return response()->json(['success' => true, 'mode' => $mode]);
  });

  // --- Notification --- //
  Route::get('/notification/{id}', [NotificationController::class, 'getNotifications']);

  // --- Dashboard --- //
  Route::get('/jomsdashboard', [JOMSDashboardController::class, 'FormCount']);
  Route::get('/pendingrequest/{id}', [JOMSDashboardController::class, 'PendingRequest']);
  Route::get('/pendingrequestcount/{id}', [JOMSDashboardController::class, 'PendingRequestCount']);
  Route::get('/formtracking/{id}', [JOMSDashboardController::class, 'FormTracking']);
  Route::get('/requestgraph', [JOMSDashboardController::class, 'RequestGraph']);
  Route::get('/mostreq', [JOMSDashboardController::class, 'MostReqPersonnel']);

  // --- Check Code Clearance --- //
  Route::get('/checkcc/{id}', [UserController::class, 'checkCode']);

  // --- Team List --- //
  Route::get('/teams', [AnnounceController::class, 'teamList']);

  // --- Notification --- //
  Route::put('/read/{id}', [NotificationController::class, 'readNotification']);
  Route::put('/unread/{id}', [NotificationController::class, 'updateOldNotifications']);

  // --- Announcement --- //
  Route::post('/addannouncements', [AnnounceController::class, 'storeAnnouncements']);
  Route::put('/editannouncements/{id}', [AnnounceController::class, 'editAnnouncements']);
  Route::delete('/deleteannouncements/{id}', [AnnounceController::class, 'deleteAnnouncements']);
  Route::get('/showannouncements', [AnnounceController::class, 'showAnnouncements']);

  // --- User Employee Details --- //
  Route::post('/register', [AuthController::class, 'register']); // Register Personnel
  Route::put('/updatedetail/{id}', [UserController::class, 'updateEmployeeDetail']); // Update Employee Details
  Route::put('/updatecc/{id}', [UserController::class, 'updateEmployeeCodeClearance']); // Update Employee Code Clearance
  Route::put('/updateaavatar/{id}', [UserController::class, 'updateEmployeeAvatar']); // Update Employee Avatar
  Route::put('/updateesig/{id}', [UserController::class, 'updateEmployeeEsig']); // Update Employee Esig
  Route::put('/updatepassword/{id}', [UserController::class, 'updatePassword']); // Get employee details
  Route::delete('/deleteuser/{id}', [UserController::class, 'removeEmployee']); // Delete User
  Route::get('/showusers', [UserController::class, 'showEmployee']); // Show employee list
  Route::get('/userdetail/{id}', [UserController::class, 'employeeDetails']); // Get employee details
  Route::get('/getsupervisor', [UserController::class, 'getSupervisor']); // Get supervisor details
  Route::get('/getgso', [UserController::class, 'getGSO']); // Get GSO details
  Route::get('/getsecurity/{id}', [UserController::class, 'getSecurity']);
  Route::put('/reactivate/{id}', [UserController::class, 'reactivateEmployee']);

  // --- JOMS (Travel Details) --- //
  Route::get('/displaydrivers', [TravelDetailController::class, 'showDrivers']);
  Route::get('/displayassignpersonnel', [TravelDetailController::class, 'showPersonnel']);
  Route::get('/getdriverspersonnel', [TravelDetailController::class, 'showDriversPersonnels']);
  Route::get('/getassignpersonnel', [TravelDetailController::class, 'showAssignPersonnels']);
  Route::get('/showvehdet', [TravelDetailController::class, 'getVehicleDetails']);
  Route::get('/checktravelactivity', [TravelDetailController::class, 'CheckTravelActivity']);
  Route::post('/sumbmitdrivers', [TravelDetailController::class, 'addDriverPersonnels']);
  Route::post('/sumbmitassignpersonnel', [TravelDetailController::class, 'addAssignPersonnels']);
  Route::post('/submitvehtype', [TravelDetailController::class, 'storeVehicleDetails']);
  Route::put('/notavaildriver/{id}', [TravelDetailController::class, 'notavailDriver']);
  Route::put('/availdriver/{id}', [TravelDetailController::class, 'availDriver']);
  Route::put('/notavailvehicle/{id}', [TravelDetailController::class, 'notavailableVehicle']);
  Route::put('/editvehicle/{id}', [TravelDetailController::class, 'editVehicle']);
  Route::put('/availvehicle/{id}', [TravelDetailController::class, 'availableVehicle']);
  Route::put('/checktsavailability', [TravelDetailController::class, 'CheckDriverAvailability']);
  Route::put('/arriveTravel/{id}', [TravelDetailController::class, 'arriveTravel']);
  Route::put('/checktravelschedule', [TravelDetailController::class, 'checkTravelSchedule']);
  Route::delete('/removepersonnel/{id}', [TravelDetailController::class, 'removePersonnel']);
  Route::delete('/removeassignpersonnel/{id}', [TravelDetailController::class, 'removeAssignPersonnel']);
  Route::delete('/deletevehdet/{id}', [TravelDetailController::class, 'removeVehicleDetails']);

  // --- Assign Personnel --- //
  Route::get('/displaypersonnel/{id}', [UserController::class, 'displayPersonnel']); // Display personnel on select tag on Part B

  // --- JOMS (My Request) --- //
  Route::get('/jomsmyrequest/{id}', [UserController::class, 'GetMyInspRequestJOMS']); // Show my Request

  // --- JOMS Inspection Request --- //
  Route::get('/inspection/pdf/{id}', [InspectionController::class, 'generateInspectionPDF']);
  Route::get('/allinspection', [InspectionController::class, 'index']);
  Route::get('/showinsprequest/{id}', [InspectionController::class, 'showInspectionForm']);
  Route::post('/submitinsprequest', [InspectionController::class, 'storeInspectionRequest']);
  Route::put('/updateinsprequestparta/{id}', [InspectionController::class, 'updatePartA']);
  Route::put('/supinsprequestapprove/{id}', [InspectionController::class, 'approveSupervisor']);
  Route::put('/supinsprequestdisapprove/{id}', [InspectionController::class, 'disapproveSupervisor']);
  Route::put('/submitinsprequestpartb/{id}', [InspectionController::class, 'submitPartB']);
  Route::put('/updateinsprequestpartb/{id}', [InspectionController::class, 'updatePartB']);
  Route::put('/admininsprequestapprove/{id}', [InspectionController::class, 'approveAdmin']);
  Route::put('/submitinsprequestpartc/{id}', [InspectionController::class, 'submitPartC']);
  Route::put('/updateinsprequestpartc/{id}', [InspectionController::class, 'updatePartC']);
  Route::put('/submitinsprequestpartd/{id}', [InspectionController::class, 'submitPartD']);
  Route::put('/updateinsprequestpartd/{id}', [InspectionController::class, 'updatePartD']);
  Route::get('/closeinspectionrequest/{id}', [InspectionController::class, 'closeRequest']);
  Route::put('/cancelinspectionrequest/{id}', [InspectionController::class, 'cancelRequest']);

  // --- JOMS Facility / Venue Request --- //
  Route::get('/facility/pdf/{id}', [FacilityVenueController::class, 'generateFacilityPDF']);
  Route::post('/checkavailability', [FacilityVenueController::class, 'checkAvailability']); // Check the availability
  Route::post('/submitfacrequest', [FacilityVenueController::class, 'storeFacilityRequest']); // Submit the request
  Route::put('/editfacrequest/{id}', [FacilityVenueController::class, 'editFacilityRequest']);
  Route::put('/oprinstruct/{id}', [FacilityVenueController::class, 'submitOPRInstruction']); // Input OPR Instruction
  Route::put('/opraction/{id}', [FacilityVenueController::class, 'submitOPRAction']); // Input OPR Action
  Route::put('/editoprinstruct/{id}', [FacilityVenueController::class, 'editOPRInstruction']);
  Route::put('/editopraction/{id}', [FacilityVenueController::class, 'editOPRAction']);
  Route::put('/adminfacapproval/{id}', [FacilityVenueController::class, 'adminApproval']); // Admin Approve
  Route::put('/adminfacdisapproval/{id}', [FacilityVenueController::class, 'adminDisapproval']); 
  Route::put('/closefacilityforce/{id}', [FacilityVenueController::class, 'cancelRequest']); // Force close the Form
  Route::get('/closefacility/{id}', [FacilityVenueController::class, 'closeRequest']);
  Route::get('/showfacvenrequest/{id}', [FacilityVenueController::class, 'showFacilityVenueForm']); // Show Facility / Venue Form Details
  Route::get('/allfacility', [FacilityVenueController::class, 'index']); // Show All Details

  // --- JOMS Vehicle Slip Request --- //
  Route::post('/submitvehrequest', [VehicleSlipController::class, 'storeVehicleSlip']);
  // Route::post('/submitvehtype', [VehicleSlipController::class, 'storeVehicleDetails']);
  Route::put('/updatevehicleslip/{id}', [VehicleSlipController::class, 'UpdateVehicleSlip']);
  Route::get('/allvehicleslip', [VehicleSlipController::class, 'index']);
  Route::get('/showvehrequest/{id}', [VehicleSlipController::class, 'showForm']);
  Route::put('/storevehinfo/{id}', [VehicleSlipController::class, 'storeVehicleInformation']);
  Route::put('/vehreqapprove/{id}', [VehicleSlipController::class, 'approveRequest']);
  Route::put('/admindecline/{id}', [VehicleSlipController::class, 'submitAdminDeclineRequest']);
  Route::get('/getvehdet', [VehicleSlipController::class, 'getVehicleDetails']);
  Route::get('/getdriverdet', [VehicleSlipController::class, 'getDriverDetails']);
  // Route::get('/showvehdet', [VehicleSlipController::class, 'showVehicleDetails']);
  Route::put('/cancelrequest/{id}', [VehicleSlipController::class, 'cancelFormRequest']);
  // Route::put('/notavailvehicle/{id}', [VehicleSlipController::class, 'notavailableVehicle']);
  // 
  // 
  // Route::delete('/deletevehdet/{id}', [VehicleSlipController::class, 'removeVehicleDetails']);
  Route::get('/closevehicle/{id}', [VehicleSlipController::class, 'closeRequest']);
});

// --- Login --- //
Route::post('/login', [AuthController::class, 'login']);

// --- Update User's Password --- //
Route::put('/updateuser', [AuthController::class, 'updateUser']);

// --- Logs --- //
Route::get('/getlogs', [LogsController::class, 'dashboardLogs']);
Route::get('/datelogs', [LogsController::class, 'datelogs']);
Route::post('/showlogs', [LogsController::class, 'showLogs']);

// --- Test --- //
Route::get('/getlocreq/{id}', [LocatorSlipController::class, 'getRequestor']);
// Route::get('/inspection/download/{id}', [InspectionController::class, 'ForcePDF']);