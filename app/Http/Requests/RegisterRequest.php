<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'PPA_No' => 'required|string',
            'fname' => 'required|string',
            'mname' => 'required|string',
            'lname' => 'required|string',
            'sex' => 'required|string',
            'division' => 'required|string',
            'position' => 'required|string',
            'display_picture' => [
                'required', 
                'file', 
                'mimes:png'
            ],
            'esig' => [
                'required', 
                'file', 
                'mimes:png'
            ],
        ];
    }
}
