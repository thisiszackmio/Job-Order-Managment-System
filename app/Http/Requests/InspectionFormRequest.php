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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'user_id' => 'required|numeric',
            'user_name' => 'required|string',
            'property_number' => 'nullable|string',
            'acquisition_date' => 'nullable|date',
            'acquisition_cost' => 'nullable|string',
            'brand_model' => 'nullable|string',
            'serial_engine_no' => 'nullable|string',
            'type_of_property' => 'required|string',
            'property_description' => 'required|string',
            'location' => 'required|string',
            'complain' => 'required|string',
            'date_of_filling' => 'nullable|date',
            'date_of_last_repair' => 'nullable|date',
            'nature_of_last_repair' => 'nullable|string',
            'before_repair_date' => 'nullable|date',
            'after_reapir_date' => 'nullable|date',
            'findings' => 'nullable|string',
            'recommendations' => 'nullable|string',
            'remarks' => 'nullable|string',
            'supervisor_id' => 'required|numeric',
            'supervisor_name' => 'required|string',
            'personnel_id' => 'nullable|numeric',
            'personnel_name' => 'nullable|string',
            'supervisor_status' => 'required|numeric',
            'admin_status' => 'required|numeric',
            'inspector_status' => 'required|numeric',
            'form_status' => 'required|numeric',
            'form_remarks' => 'nullable|string'
        ];
    }
}
