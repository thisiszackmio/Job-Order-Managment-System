<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdminInspectionRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'insp_id' => 'exists:inspection__forms,insp_id',
            'date_of_filling' => 'required|string',
            'date_of_last_repair' => 'required|string',
            'nature_of_last_repair' => 'required|string',
            'assign_personnel' => 'required|numeric'
        ];
    }
}
