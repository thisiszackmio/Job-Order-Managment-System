<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FacilityRequest extends FormRequest
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
            'date_requested' => 'required|date',
            'request_office' => 'required|string',
            'title_of_activity' => 'required|string',
            'date_start' => 'required|date',
            'time_start' => 'required|date_format:H:i',
            'date_end' => 'required|date',
            'time_end' => 'required|date_format:H:i',
            'mph' => 'required|boolean',
            'conference' => 'required|boolean',
            'dorm' => 'required|boolean',
            'other' => 'required|boolean',
            'table' => 'required|boolean', 
            'no_table' => $this->input('table') ? 'required|numeric' : 'nullable|numeric',
            'chair' => 'required|boolean',
            'no_chair' => $this->input('chair') ? 'required|numeric' : 'nullable|numeric',
            'microphone' => 'required|boolean',
            'no_microphone' => $this->input('microphone') ? 'required|numeric' : 'nullable|numeric',
            'others' => 'required|boolean',
            'specify' => $this->input('others') ? 'required|string' : 'nullable|string',
            'projector' => 'required|boolean',
            'projector_screen' => 'required|boolean',
            'document_camera' => 'required|boolean',
            'laptop' => 'required|boolean',
            'television' => 'required|boolean',
            'sound_system' => 'required|boolean',
            'videoke'=> 'required|boolean',
            'name_male' => 'nullable|string',
            'name_female' => 'nullable|string',
            'other_details' => 'nullable|string',
            'admin_approval' => 'required|numeric',
            'date_approve' => 'nullable|date',
            'obr_instruct' => 'nullable|string',
            'obr_comment' => 'nullable|string',
            'remarks' => 'nullable|string',
        ];
    }
}
