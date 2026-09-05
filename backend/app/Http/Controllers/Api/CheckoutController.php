<?php

namespace App\Http\Controllers\Api;

use App\Enums\CheckoutStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCheckoutRequest;
use App\Models\AbandonedCheckout;
use App\Models\Campaign;
use Illuminate\Http\JsonResponse;

class CheckoutController extends Controller
{
    /**
     * Upsert the abandoned-checkout draft for this visit. The landing page
     * calls this repeatedly (debounced, plus once more on tab close) as the
     * visitor fills the order form, keyed by the browser-generated token.
     */
    public function store(StoreCheckoutRequest $request): JsonResponse
    {
        $data = $request->validated();

        $checkout = AbandonedCheckout::firstOrNew(['token' => $data['token']]);

        // Once it's turned into an order (or been closed by hand) we leave the
        // draft frozen — a late-firing save from the browser must not reopen it.
        if ($checkout->exists && $checkout->status->isTerminal()) {
            return response()->json([
                'token' => $checkout->token,
                'status' => $checkout->status->value,
            ]);
        }

        $campaign = Campaign::resolveFromAttribution($data);

        $checkout->fill([
            'customer_name' => $data['customer_name'] ?? null,
            'customer_phone' => $data['customer_phone'] ?? null,
            'customer_address' => $data['customer_address'] ?? null,
            'product_name' => $data['product_name'] ?? null,
            'variant' => $data['variant'] ?? null,
            'color' => $data['color'] ?? null,
            'quantity' => $data['quantity'] ?? 1,
            'unit_price' => $data['unit_price'] ?? 0,
            'shipping_zone' => $data['shipping_zone'] ?? null,
            'shipping_fee' => $data['shipping_fee'] ?? 0,
            'status' => CheckoutStatus::Active,
            'campaign_id' => $campaign?->id,
            'ad_identifier' => $data['ad_identifier'] ?? null,
            'utm_source' => $data['utm_source'] ?? null,
            'utm_medium' => $data['utm_medium'] ?? null,
            'utm_campaign' => $data['utm_campaign'] ?? null,
            'utm_content' => $data['utm_content'] ?? null,
            'utm_term' => $data['utm_term'] ?? null,
            'fbclid' => $data['fbclid'] ?? null,
            'fbp' => $data['fbp'] ?? null,
            'fbc' => $data['fbc'] ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'last_activity_at' => now(),
        ]);

        $checkout->save_count = ($checkout->save_count ?? 0) + 1;
        $checkout->save();

        return response()->json([
            'token' => $checkout->token,
            'status' => $checkout->status->value,
        ], $checkout->wasRecentlyCreated ? 201 : 200);
    }
}
