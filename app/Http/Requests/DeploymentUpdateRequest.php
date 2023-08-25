<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeploymentUpdateRequest extends FormRequest
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
            'user_id' => 'exists:user_id',
            'type_of_service' => 'required|string',
            'type_of_repair' => 'nullable|string',
            'details_repair' => 'nullable|string',
            'location_repair' => 'nullable|string',
            'type_of_personel' => 'nullable|string',
            'details_personel' => 'nullable|string',
            'personel_purpose' => 'nullable|string',
            'location_personel' => 'nullable|string',
            'details_supply' => 'nullable|string',
            'no_of_supplies' => 'nullable|numeric',
        ];
    }
}
