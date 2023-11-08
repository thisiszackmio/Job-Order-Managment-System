<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\Rule;

class DateTimeComparison implements Rule
{
    protected $startFieldName;

    public function __construct($startFieldName)
    {
        $this->startFieldName = $startFieldName;
    }

    public function passes($attribute, $value)
    {
        $startValue = request($this->startFieldName);
        return strtotime($value) >= strtotime($startValue);
    }

    public function message()
    {
        return 'The end date and time must not be before the start date and time.';
    }
}
