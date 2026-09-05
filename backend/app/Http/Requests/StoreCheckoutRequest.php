<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Public — the landing page posts partial checkout data here as the
        // visitor fills the order form.
        return true;
    }

    public function rules(): array
    {
        return [
            // The one required field: the browser-generated token that keeps
            // every partial save from one visit on the same row.
            'token' => ['required', 'string', 'min:8', 'max:64'],

            // Everything below is whatever the visitor had entered so far —
            // all optional by design.
            'customer_name' => ['nullable', 'string', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:30'],
            'customer_address' => ['nullable', 'string', 'max:1000'],

            'product_name' => ['nullable', 'string', 'max:255'],
            'variant' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:1000'],
            'unit_price' => ['nullable', 'numeric', 'min:0'],
            'shipping_zone' => ['nullable', 'string', 'max:255'],
            'shipping_fee' => ['nullable', 'numeric', 'min:0'],

            // Ad attribution — same fields the order form sends on submit.
            'campaign' => ['nullable', 'string', 'max:255'],
            'ad_identifier' => ['nullable', 'string', 'max:255'],
            'utm_source' => ['nullable', 'string', 'max:255'],
            'utm_medium' => ['nullable', 'string', 'max:255'],
            'utm_campaign' => ['nullable', 'string', 'max:255'],
            'utm_content' => ['nullable', 'string', 'max:255'],
            'utm_term' => ['nullable', 'string', 'max:255'],
            'fbclid' => ['nullable', 'string', 'max:255'],
            'fbp' => ['nullable', 'string', 'max:255'],
            'fbc' => ['nullable', 'string', 'max:255'],
        ];
    }
}
