<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Public order form — anyone can submit an order.
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'customer_address' => ['nullable', 'string', 'max:1000'],

            // Ties the order back to the abandoned-checkout draft the browser
            // was saving as the visitor filled the form.
            'checkout_token' => ['nullable', 'string', 'max:64'],

            'product_name' => ['required', 'string', 'max:255'],
            'variant' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:1', 'max:1000'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'shipping_zone' => ['nullable', 'string', 'max:255'],
            'shipping_fee' => ['nullable', 'numeric', 'min:0'],
            'district' => ['nullable', 'string', 'max:255'],

            // Ad attribution — all optional, populated by the landing page from
            // the URL's UTM params / fbclid and the fbp/fbc cookies.
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

            // Meta ad hierarchy from the ad's URL parameters.
            'fb_campaign_id' => ['nullable', 'string', 'max:255'],
            'fb_adset_id' => ['nullable', 'string', 'max:255'],
            'fb_ad_id' => ['nullable', 'string', 'max:255'],
            'adset_name' => ['nullable', 'string', 'max:255'],
            'ad_name' => ['nullable', 'string', 'max:255'],
            'placement' => ['nullable', 'string', 'max:255'],

            // Visit details — where the visitor landed, where they came from,
            // their browser session and how long they took to order.
            'landing_page' => ['nullable', 'string', 'max:2000'],
            'referrer' => ['nullable', 'string', 'max:2000'],
            'session_id' => ['nullable', 'string', 'max:64'],
            'time_to_order_seconds' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
