<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Inspector_Form_Request extends FormRequest
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
        'inspection__form_id' => 'string|nullable',
        'before_repair_date' => 'string|required',
        'findings' => 'string|required',
        'recommendations' => 'string|required',
        'after_repair_date' => 'string|nullable',
        'remarks' => 'string|nullable',
        'close' => 'numeric|nullable'
    ];
}
}
