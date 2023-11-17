<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FormDormFacilityRequest extends FormRequest
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
            'facility_id' => 'exists:request__facility,facility_id',
            'name_male' => 'required|string',
            'name_female' => 'required|string',
            'other_details' => 'required|string',
        ];
    }
}
