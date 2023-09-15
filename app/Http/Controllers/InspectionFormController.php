<?php

namespace App\Http\Controllers;

use App\Http\Requests\InspectionFormRequest;
use App\Models\Inspection_Form;
use Illuminate\Http\Request;

class InspectionFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(InspectionFormRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->user()->id;

        $deploymentData = Inspection_Form::create($data);

        return response()->json(['message' => 'Deployment data created successfully'], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(InspectionFormRequest $request, $id)
    {
        $data = $request->validated($id);

        // Check if the button is clicked (you need to determine the specific condition)
        if ($request->has('button_clicked')) {
        // Update the supervisor_approval field to 1
        $inspectionForm->repair['supervisor_approval'] = 1;
        $inspectionForm->save();
    }

    // Rest of your update logic here

    return redirect()->back()->with('success', 'Form updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inspection_Form $inspection_Form)
    {
        //
    }
}
