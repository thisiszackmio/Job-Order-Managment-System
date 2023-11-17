<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FormConferenceFacilityRequest extends FormRequest
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
            'table' => 'required|boolean',
            'no_table' => 'nullable|numeric',
            'chair' => 'required|boolean',
            'no_chair' => 'nullable|numeric',
            'microphone' => 'required|boolean',
            'no_microphone' => 'nullable|numeric',
            'others' => 'required|boolean',
            'specify'  => 'nullable|string',
            'projector' => 'required|boolean',
            'projector_screen' => 'required|boolean',
            'document_camera' => 'required|boolean',
            'laptop' => 'required|boolean',
            'television' => 'required|boolean',
            'sound_system' => 'required|boolean',
            'videoke' => 'required|boolean'
        ];
    }
}
