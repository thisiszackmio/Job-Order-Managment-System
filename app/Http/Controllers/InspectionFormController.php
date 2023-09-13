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
     * Display the specified resource.
     */
    public function show(Inspection_Form $inspection_Form)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Inspection_Form $inspection_Form)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Inspection_Form $inspection_Form)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inspection_Form $inspection_Form)
    {
        //
    }
}
