<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeploymentDataRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust authorization logic if needed
    }

    public function rules()
    {
        return [
            'user_id' => 'exists:users,id',
            'type_of_service' => 'required|string',
            'type_of_repair' => 'nullable|string',
            'detail_repair' => 'nullable|string',
            'location_repair' => 'nullable|string',
            'type_of_personel' => 'nullable|string',
            'detail_personnel' => 'nullable|string',
            'purpose_personnel' => 'nullable|string',
            'location_personnel' => 'nullable|string',
            'detail_supply' => 'nullable|string',
            'supply_no' => 'nullable|numeric',
        ];
    }
}
