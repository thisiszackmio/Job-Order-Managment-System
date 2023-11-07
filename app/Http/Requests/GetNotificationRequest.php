<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetNotificationRequest extends FormRequest
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
            'sender_id' => 'nullable|numeric',
            'receiver_id' => 'nullable|numeric',
            'url' => 'nullable|string',
            'subject' => 'nullable|string',
            'message' => 'nullable|string',
            'get_status' => 'nullable|numeric'
        ];
    }
}
