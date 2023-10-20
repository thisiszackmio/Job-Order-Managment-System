<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
    public function index()
    {
        $assignPersonnels = AssignPersonnel::with('user')->get();
        $assignPersonnels = AssignPersonnel::all();

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
                    'id' => $userId,
                    'fname' => $userName,
                    'mname' => $userMiddleInitial,
                    'lname' => $userLastName,
                    'type' => $assignPersonnel->type_of_personnel
                ],
            ];
        }


        return response()->json($responseData);
        
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
        ->where('close', 0)->get();

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
        //Get the ID bassed on the Inspection form
        $inspForm = AdminInspectionForm::where('inspection__form_id', $id)->get();

        //Get Personnel ID
        $pID = $inspForm->pluck('assign_personnel')->first();

        //Get the Personnel Details
        $pDet = PPAUser::where('id', $pID)->get();

        $respondData = [
            'personnel_details' => $pDet->map(function ($PersonnelDetail) {
                $signature = URL::to('/storage/esignature/' . $PersonnelDetail->image);
                return[
                    'p_id' => $PersonnelDetail->id,
                    'p_name' => $PersonnelDetail->fname.' '.$PersonnelDetail->mname.'. '.$PersonnelDetail->lname,
                    'p_signature' => $signature,
                ];
            })
        ];

        return response()->json($respondData);
    }
}
