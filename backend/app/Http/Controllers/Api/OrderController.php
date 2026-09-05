<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\AbandonedCheckout;
use App\Models\Campaign;
use App\Models\Customer;
use App\Models\Order;
use App\Services\MetaConversionsApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request, MetaConversionsApiService $capi): JsonResponse
    {
        $data = $request->validated();

        $order = DB::transaction(function () use ($data, $request) {
            // Reuse an existing customer by phone number if we've seen them before.
            $customer = Customer::firstOrCreate(
                ['phone' => $data['customer_phone']],
                ['name' => $data['customer_name'], 'address' => $data['customer_address'] ?? null]
            );

            if ($customer->wasRecentlyCreated === false) {
                $customer->fill([
                    'name' => $data['customer_name'],
                    'address' => $data['customer_address'] ?? $customer->address,
                ])->save();
            }

            $campaign = Campaign::resolveFromAttribution($data);

            $order = Order::create([
                'customer_id' => $customer->id,
                'product_name' => $data['product_name'],
                'variant' => $data['variant'] ?? null,
                'color' => $data['color'] ?? null,
                'quantity' => $data['quantity'],
                'unit_price' => $data['unit_price'],
                'shipping_zone' => $data['shipping_zone'] ?? null,
                'shipping_fee' => $data['shipping_fee'] ?? 0,
                'status' => OrderStatus::New,
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
            ]);

            // Close out the abandoned-checkout draft(s) this order came from —
            // the token the browser kept, plus any other open checkout on the
            // same phone number.
            AbandonedCheckout::query()
                ->whereNull('order_id')
                ->where(function ($query) use ($data, $customer) {
                    $query->where('customer_phone', $customer->phone);

                    if (filled($data['checkout_token'] ?? null)) {
                        $query->orWhere('token', $data['checkout_token']);
                    }
                })
                ->get()
                ->each(fn (AbandonedCheckout $checkout) => $checkout->markConverted($order));

            return $order;
        });

        // Best-effort — never let a CAPI hiccup fail the customer's order.
        try {
            $capi->sendPurchaseEvent($order->fresh('customer'));
        } catch (\Throwable) {
            // Already logged inside the service.
        }

        return response()->json([
            'order_number' => $order->order_number,
            'status' => $order->status->value,
            // Shared with the browser pixel so Meta dedupes the Purchase event.
            'event_id' => MetaConversionsApiService::purchaseEventId($order),
        ], 201);
    }
}
