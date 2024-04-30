<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VehicleFormRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules()
    {
        return [
            'user_id'  => 'exists:p_p_a_users,id',
            'date_of_request' => 'required|date',
            'purpose' => 'required|string',
            'passengers' => 'required|string',
            'place_visited' => 'required|string',
            'date_arrival' => 'required|date',
            'time_arrival' => 'required|date_format:H:i',
            'vehicle_type' => 'required|string',
            'driver' => 'required|string',
            'admin_approval' => 'required|numeric',
            'remarks' => 'required|string'
        ];
    }
}
