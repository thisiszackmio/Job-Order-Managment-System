<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FacilityFormRequest extends FormRequest
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
            'request_office' => 'required|string',
            'title_of_activity' => 'required|string',
            'date_start' => 'required|date',
            'time_start' => 'required|date_format:H:i',
            'date_end' => 'required|date',
            'time_end' => 'required|date_format:H:i',
            'mph' => 'required|numeric',
            'conference' => 'required|numeric',
            'dorm' => 'required|numeric',
            'other' => 'required|numeric',
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
            'videoke' => 'required|boolean',
            'name_male' => 'nullable|string',
            'name_female' => 'nullable|string',
            'other_details' => 'nullable|string',
            'admin_approval' => 'required|numeric',
            'obr_instruct' => 'nullable|string',
            'date_approve' => 'nullable|date',
            'remarks' => 'nullable|string',
        ];
    }
}
