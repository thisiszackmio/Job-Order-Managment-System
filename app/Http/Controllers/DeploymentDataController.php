<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDeploymentDataRequest;
use App\Models\DeploymentData;
use Illuminate\Http\Request;

class DeploymentDataController extends Controller
{
    public function store(StoreDeploymentDataRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->user()->id;

        $deploymentData = DeploymentData::create($data);

        return response()->json(['message' => 'Deployment data created successfully'], 201);
    }
}
