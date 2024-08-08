<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

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
            'firstname' => 'required|string',
            'middlename' => 'required|string',
            'lastname' => 'required|string',
            'gender' => 'required|string',
            'division' => 'required|string',
            'position' => 'required|string',
            'code_clearance' => 'required|string',
            'username' => 'required|string',
            'esig' => [
                'required', 
                'file', 
                'mimes:png',
                'max:2048'
            ],
            'avatar' => [
                'required', 
                'file', 
                'mimes:png,jpeg,jpg',
                'max:2048'
            ],
            'password' => [
                'required',
                Password::min(8)->mixedCase()->numbers()->symbols()
            ],
            'status' => 'required|numeric',
        ];
    }
}
