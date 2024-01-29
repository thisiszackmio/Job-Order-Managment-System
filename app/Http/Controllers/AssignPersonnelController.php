<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\AssignPersonnelRequest;
use App\Models\AssignPersonnel;
use App\Models\AdminInspectionForm;
use App\Models\Inspection_Form;
use App\Models\Inspector_Form;
use App\Models\PPAUser;
use Illuminate\Support\Facades\URL;

class AssignPersonnelController extends Controller
{

    /**
     * Show Personnel List.
     */
    public function index(Request $request, $id)
    {
        $find = Inspection_Form::find($id);

        if($find->type_of_property == "Vehicle Supplies & Materials"){
            $PersonnelHehe = [
                "Driver/Mechanic",
                "Janitorial Service",
                "Watering Services",
            ];
        } elseif($find->type_of_property == "IT Equipment & Related Materials"){
            $PersonnelHehe = [
                "IT Service",
                "Electronics",
                "Electrical Works",
                "Engeneering Services",
            ];
        } else {
            $PersonnelHehe = [
                "Driver/Mechanic",
                "IT Service",
                "Janitorial Service",
                "Electronics",
                "Electrical Works",
                "Watering Services",
                "Engeneering Services",
            ];
        }

        $assignPersonnels = AssignPersonnel::with('user')->whereIn("type_of_personnel", $PersonnelHehe)->get();
        // $assignPersonnels = AssignPersonnel::all();

        // if ($assignPersonnels->isEmpty()) {
        //     return response()->json($assignPersonnels);
        // }
        
        $responseData = [];

        foreach ($assignPersonnels as $assignPersonnel) {
            $ppaUser = $assignPersonnel->user;


            $userId = $ppaUser->id;
            $userName = $ppaUser->fname;
            $userMiddleInitial = $ppaUser->mname;
            $userLastName = $ppaUser->lname;

            $responseData[]= [
                'personnel_details' => [
                    'ap_id' =>  $assignPersonnel->id,
                    'user_id' => $userId,
                    'fname' => $userName,
                    'mname' => $userMiddleInitial,
                    'lname' => $userLastName,
                    'type' => $assignPersonnel->type_of_personnel
                ],
            ];
        }


        // return response()->json($responseData);

        return response()->json($responseData);
        
    } 

    /**
     * Assign Personnel.
     */
    public function storePersonnel(AssignPersonnelRequest $request)
    {
        $data = $request->validated();

        // Check if the data already exists based on your criteria (e.g., user_id and type_of_personnel)
        $existingData = AssignPersonnel::where('user_id', $data['user_id'])
            ->where('type_of_personnel', $data['type_of_personnel'])
            ->first();

        if ($existingData) {
            return response()->json(['error' => 'Data already exists'], 409); // 409 Conflict status code
        }

        $deploymentData = AssignPersonnel::create($data);

        if (!$deploymentData) {
            return response()->json(['error' => 'Data Error'], 500);
        } else {
            $update = PPAUser::where('id', $data['user_id'])->first();
            if ($update->code_clearance == 5) {
                $update->code_clearance = 6;
                $update->save(); // Save the changes to the database
            }
        }

        return response()->json(['message' => 'Deployment data created successfully'], 200);
    }

    /**
     * Show Personnel List on Dashboard.
     */
    public function showPersonnel(Request $request, $id)
    {
        // Get Personnel ID
        $personnelID = AssignPersonnel::where('user_id', $id)->get();
        $perID = $personnelID->pluck('user_id')->all();

        if($personnelID->isEmpty()) {
            return response()->json(['message' => 'No data'], 404);
        }

        // Get the Form filled up by the GSO and also the ID
        $getForm = AdminInspectionForm::where('assign_personnel', $perID)->get();
        $gformId = $getForm->pluck('inspection__form_id')->all();

        //Get Inspector Details
        $ins = Inspector_Form::whereIn('inspection__form_id', $gformId)
        ->where('close', 3)->get();

        //Get the Request Details
        $gId = $ins->pluck('inspection__form_id')->all();
        $getInspDet = Inspection_Form::whereIn('id', $gId)->get();

        //Get the name of the requestor
        $emId = $getInspDet->pluck('user_id')->all();
        $emName = PPAUser::whereIn('id', $emId)->get();

        $respondData = [
            'inspection_details' => $getInspDet->map(function ($showDetail) use ($emName) {
                $requesters = $emName->where('id', $showDetail->user_id)->map(function ($user) {
                    $fullName = "{$user->fname} ";
                    if ($user->mname) { $fullName .= "{$user->mname}. "; }
                    $fullName .= $user->lname;
                    return $fullName; })
                    ->implode(', ');

                return[
                    'id' => $showDetail->id,
                    'requester' => $requesters,
                    'date_requested' => $showDetail->date_of_request,
                    'property_no' => $showDetail->property_number,
                    'description' => $showDetail->property_description,
                    'location' => $showDetail->location,
                    'complain' => $showDetail->complain
                ];
            }),

            'inspection_status' => $ins->map(function ($getStat){
                return[
                    'status' => $getStat->close
                ];
            })
        ];

        if($respondData['inspection_details']->isEmpty()) {
            return response()->json(['message' => 'No Assign For You'], 404);
        }

        return response()->json($respondData);
        
    } 

    /**
     * Get Personnel List on View Form.
     */
    public function getPersonnel(Request $request, $id)
    {
        // Get the ID based on the Inspection form
        $inspForm = AdminInspectionForm::where('inspection__form_id', $id)->first();
    
        if (!$inspForm) {
            // Handle case where no inspection form is found
            return response()->json(['error' => 'Inspection form not found'], 404);
        }
    
        // Get Personnel ID
        $pID = $inspForm->assign_personnel;
    
        // Get the Personnel Details
        $pDet = PPAUser::find($pID);
    
        if (!$pDet) {
            // Handle case where no personnel is found
            return response()->json(['error' => 'Personnel not found'], 404);
        }
    
        $signature = URL::to('/storage/esignature/' . $pDet->image);
    
        $respondData = [
            'personnel_details' => [
                'p_id' => $pDet->id,
                'p_name' => $pDet->fname . ' ' . $pDet->mname . '. ' . $pDet->lname,
                'p_signature' => $signature,
            ],
        ];
    
        return response()->json($respondData);
    }

    /**
     * Remove Personnel List on View Form.
     */
    public function RemovePersonnel($id)
    {
        $user = AssignPersonnel::find($id);
    
        if (!$user) {
            return response()->json(['message' => 'Personnel not found'], 404);
        }

        $update = PPAUser::where('id', $user->user_id)->first();
        $update->code_clearance;

        if ($update->code_clearance == 6) {
            $update->code_clearance = 5;
            $update->save();
        }

        $user->delete();
    
        return response()->json(['message' => 'Personnel deleted successfully'], 200);
    }

    /**
     * Get Driver Information.
     */
    public function getDriver()
    {
        $driverRecords = AssignPersonnel::where('type_of_personnel', 'Driver/Mechanic')->get();
        $driverIds = $driverRecords->pluck('user_id')->all();

        $drivers = PPAUser::whereIn('id', $driverIds)->get();
        $driverNames = $drivers->map(function ($driver) {
            return [
                'driver_id' => $driver->id,
                'driver_name' => $driver->fname . ' ' . $driver->mname . '. ' . $driver->lname,
            ];
        });

        return response()->json($driverNames);
    }

}
