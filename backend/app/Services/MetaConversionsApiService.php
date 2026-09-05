<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Sends a "Purchase" event to Meta's Conversions API (server-side) so ad
 * attribution / campaign optimization stays accurate even when browser-side
 * pixel events are blocked (ad blockers, ITP, etc).
 *
 * Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
 */
class MetaConversionsApiService
{
    public function isConfigured(): bool
    {
        return filled(config('services.meta.pixel_id')) && filled(config('services.meta.access_token'));
    }

    /**
     * The event id shared between this server-side event and the browser
     * pixel's Purchase event. Meta collapses the two into one when the id
     * (and event name) match — the API response hands this to the frontend.
     */
    public static function purchaseEventId(Order $order): string
    {
        return 'order-'.$order->id;
    }

    /**
     * Send the order as a Purchase event. Persists the outcome on the order
     * itself (capi_sent_at / capi_response) so it's visible in the admin.
     */
    public function sendPurchaseEvent(Order $order): void
    {
        if (! $this->isConfigured()) {
            Log::info('Meta CAPI skipped: pixel_id/access_token not configured.', ['order_id' => $order->id]);

            return;
        }

        $pixelId = config('services.meta.pixel_id');
        $accessToken = config('services.meta.access_token');
        $testCode = config('services.meta.test_event_code');

        $payload = [
            'data' => [[
                'event_name' => 'Purchase',
                'event_time' => $order->created_at->timestamp,
                'event_id' => self::purchaseEventId($order), // dedupe with the browser-side pixel event
                'action_source' => 'website',
                'user_data' => array_filter([
                    'ph' => [hash('sha256', preg_replace('/\D/', '', (string) $order->customer?->phone))],
                    'client_ip_address' => $order->ip_address,
                    'client_user_agent' => $order->user_agent,
                    // Prefer the real _fbc cookie captured by the pixel; fall
                    // back to reconstructing it from the raw fbclid.
                    'fbc' => $order->fbc
                        ?: ($order->fbclid ? "fb.1.{$order->created_at->timestamp}.{$order->fbclid}" : null),
                    'fbp' => $order->fbp,
                ]),
                'custom_data' => [
                    'currency' => config('services.meta.currency', 'BDT'),
                    'value' => (float) $order->total,
                    'content_name' => $order->product_name,
                    'content_ids' => [(string) $order->id],
                    'num_items' => $order->quantity,
                ],
            ]],
        ];

        if ($testCode) {
            $payload['test_event_code'] = $testCode;
        }

        try {
            $response = Http::asJson()
                ->timeout(10)
                ->post("https://graph.facebook.com/v20.0/{$pixelId}/events", [
                    ...$payload,
                    'access_token' => $accessToken,
                ]);

            $order->forceFill([
                'capi_sent_at' => now(),
                'capi_response' => $response->json() ?? ['status' => $response->status()],
            ])->saveQuietly();
        } catch (\Throwable $e) {
            Log::warning('Meta CAPI request failed.', ['order_id' => $order->id, 'error' => $e->getMessage()]);

            $order->forceFill([
                'capi_sent_at' => now(),
                'capi_response' => ['error' => $e->getMessage()],
            ])->saveQuietly();
        }
    }
}
