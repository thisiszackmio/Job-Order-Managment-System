<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'exists:p_p_a_users,id',
            'type_of_equipment' => 'required|string',
            'date_request' => 'required|date',
            'title_of_activity' => 'required|string',
            'date_of_activity' => 'required|date',
            'time_start' => 'required|date_format:H:i',
            'time_end' => 'required|date_format:H:i',
            'instructions' => 'nullable|string',
            'driver' => 'nullable|string',
            'operator' => 'nullable|string',
            'rescue_members' => 'nullable|string',
            'opr' => 'nullable|string',
            'division_manager_id' => 'required|numeric',
            'division_manager_approval' => 'required|numeric',
            'admin_manager_approval' => 'required|numeric',
            'harbor_master_approval' => 'required|numeric',
            'port_manager_approval' => 'required|numeric',
            'status' => 'nullable|numeric',
        ];
    }
}
