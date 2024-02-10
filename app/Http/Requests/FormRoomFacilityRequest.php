<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FormRoomFacilityRequest extends FormRequest
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
            'facility_form_id' => 'exists:facility_form',
            'table' => 'required|boolean',
            'no_table' => $this->input('table') ? 'required|numeric' : 'nullable|numeric',
            'chair' => 'required|boolean',
            'no_chair' => $this->input('chair') ? 'required|numeric' : 'nullable|numeric',
            'microphone' => 'required|boolean',
            'no_microphone' => $this->input('microphone') ? 'required|numeric' : 'nullable|numeric',
            'others' => 'required|boolean',
            'specify'  => $this->input('others') ? 'required|string' : 'nullable|string',
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
