<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VehicleSlipRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'user_id' => 'required|numeric',
            'user_name' => 'required|string',
            'type_of_slip' => 'required|string',
            'purpose' => 'required|string',
            'passengers' => 'nullable|string',
            'place_visited' => 'required|string',
            'date_arrival' => 'required|date',
            'time_arrival' => 'required|date_format:H:i',
            'vehicle_type' => 'required|string',
            'driver_id' => 'required|numeric',
            'driver' => 'required|string',
            'admin_approval' => 'required|numeric',
            'remarks' => 'required|string',
        ];
    }
}
