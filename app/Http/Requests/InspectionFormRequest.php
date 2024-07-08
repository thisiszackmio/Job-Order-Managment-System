<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InspectionFormRequest extends FormRequest
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
            'user_id' => 'exists:p_p_a_users,id',
            'date_of_request' => 'required|string',
            'property_number' => 'required|string',
            'acq_date' => 'required|string',
            'acq_cost' => 'required|string',
            'brand_model' => 'required|string',
            'serial_engine_no' => 'required|string',
            'type_of_property' => 'required|string',
            'property_description' => 'required|string',
            'location' => 'required|string',
            'complain' => 'required|string',
            'supervisor_name' => 'required|numeric',
            'supervisor_approval' => 'required|numeric',
            'admin_approval' => 'required|numeric',
            'inspector_status' => 'required|numeric',
            'form_status' => 'required|numeric',
            'remarks' => 'nullable|string'
        ];
    }
}
