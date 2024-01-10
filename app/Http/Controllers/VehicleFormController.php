<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VehicleForm;
use App\Models\PPAUser;
use App\Http\Requests\VehicleFormRequest;
use Illuminate\Support\Facades\URL;

class VehicleFormController extends Controller
{

    /**
     * Show the information
     */
    public function index()
    {
        $vehicleForms = VehicleForm::with('user')->orderBy('id', 'desc')->get();

        $responseData = [];

        foreach ($vehicleForms as $vehicleForm) {
            // Access the related PPAUser data
            $ppaUser = $vehicleForm->user;

            // You can now access PPAUser properties like fname, lname, etc.
            $userName = $ppaUser->fname;
            $userMiddleInitial = $ppaUser->mname;
            $userLastName = $ppaUser->lname;

            // Count the number of passengers for the specific vehicle form ID
            $passengersCount = count(explode("\n", $vehicleForm->passengers));

            $responseData[] = [
                'vehicleForms' => $vehicleForm,
                'passengersCount' => $passengersCount,
                'user_details' => [
                    'fname' => $userName,
                    'mname' => $userMiddleInitial,
                    'lname' => $userLastName,
                ]
            ];
        }

        return response()->json($responseData);
    }

    /**
     * Show information on my request
     */
    public function myRequest(Request $request, $id)
    {
        $myRequest = PPAUser::find($id);

        $getvehicleslipForms = VehicleForm::where('user_id', $id)->get(); 

        $passengersCounts = [];
        
        foreach ($getvehicleslipForms as $vehicleForm) {
            $passengersData = $vehicleForm->passengers;
            $passengersArray = explode("\n", $passengersData);
            $passengersCount = count($passengersArray);
    
            $passengersCounts[] = [
                'passengers_count' => $passengersCount,
            ];
        }

        $respondData = [
            'my_user' => $myRequest,
            'view_vehicle' => $getvehicleslipForms,
            'passenger_count' => $passengersCounts
        ];

        return response()->json($respondData);
    }

    /**
     * Show the information on the Request
     */
    public function show(Request $request, $id)
    {
        $vehicleForm = VehicleForm::find($id);

        $ppaUser = $vehicleForm->user;
        $endUser = $ppaUser->fname . ' ' . $ppaUser->mname. '. ' . $ppaUser->lname;
        $userSignature = URL::to('/storage/esignature/' . $ppaUser->image);
        $userPosition = $ppaUser->position;

        //For Admin Manager
        $ManagerUser = PPAUser::where('code_clearance', 1)->first(); // ID Number of Maam Daisy

        if (!$ManagerUser) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $ManagerName = $ManagerUser->fname . ' ' . $ManagerUser->mname. '. ' . $ManagerUser->lname;
        $ManagerSignature = URL::to('/storage/esignature/' . $ManagerUser->image);

        $respondData = [
            'vehicle_form' => $vehicleForm,
            'requestor' => [
                'name' => $endUser,
                'signature' => $userSignature,
                'position' => $userPosition,
            ],
            'manager_user_details' => [
                'manager_name' => $ManagerName,
                'manager_signature' => $ManagerSignature,
            ],
        ];

        return response()->json($respondData);
    }

    /**
     * Submit the information
     */
    public function store(VehicleFormRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->user()->id;

        $userId = PPAUser::find($data['user_id']);

        $deploymentData = VehicleForm::create($data);

        if (!$deploymentData) {
            return response()->json(['error' => 'Data Error'], 500);
        }

        // return a response, for example:
        return response()->json(['message' => 'Deployment data created successfully'], 200);
    }

    /**
     * Approve by the Division Manager
     */
    public function adminApprove(Request $request, $id)
    {
        $approveRequest = VehicleForm::find($id);

        $approveRequest->admin_approval = 1;

        if ($approveRequest->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }

    /**
     * Dispprove by the Division Manager
     */
    public function adminDisapprove(Request $request, $id)
    {
        $approveRequest = VehicleForm::find($id);

        $approveRequest->admin_approval = 2;

        if ($approveRequest->save()) {
            return response()->json(['message' => 'Deployment data created successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update the request'], 500);
        }
    }


}
