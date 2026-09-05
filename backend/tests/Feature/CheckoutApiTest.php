<?php

namespace Tests\Feature;

use App\Enums\CheckoutStatus;
use App\Models\AbandonedCheckout;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutApiTest extends TestCase
{
    use RefreshDatabase;

    private string $token = 'chk_01HZXABCDEF1234567890';

    public function test_it_creates_a_checkout_draft(): void
    {
        $response = $this->postJson('/api/checkouts', [
            'token' => $this->token,
            'customer_phone' => '01711111111',
            'product_name' => 'Comfort Bra',
            'variant' => '34',
            'quantity' => 2,
            'unit_price' => 999,
            'shipping_fee' => 60,
            'utm_campaign' => 'Summer Offer',
            'utm_source' => 'facebook',
        ]);

        $response->assertCreated();
        $response->assertJsonPath('status', CheckoutStatus::Active->value);

        $checkout = AbandonedCheckout::sole();
        $this->assertSame('01711111111', $checkout->customer_phone);
        $this->assertSame(2058.0, (float) $checkout->total); // 2 * 999 + 60
        $this->assertSame(1, $checkout->save_count);
        $this->assertSame('Summer Offer', $checkout->campaign->name);
        $this->assertNotNull($checkout->last_activity_at);
    }

    public function test_it_upserts_the_same_draft_by_token(): void
    {
        $this->postJson('/api/checkouts', [
            'token' => $this->token,
            'customer_phone' => '017',
        ])->assertCreated();

        $this->postJson('/api/checkouts', [
            'token' => $this->token,
            'customer_phone' => '01711111111',
            'customer_name' => 'Rahim',
            'unit_price' => 999,
            'quantity' => 1,
        ])->assertOk();

        $this->assertDatabaseCount('abandoned_checkouts', 1);

        $checkout = AbandonedCheckout::sole();
        $this->assertSame('Rahim', $checkout->customer_name);
        $this->assertSame('01711111111', $checkout->customer_phone);
        $this->assertSame(2, $checkout->save_count);
    }

    public function test_it_does_not_reopen_a_converted_draft(): void
    {
        $checkout = AbandonedCheckout::create([
            'token' => $this->token,
            'customer_phone' => '01711111111',
            'status' => CheckoutStatus::Ordered,
        ]);

        $this->postJson('/api/checkouts', [
            'token' => $this->token,
            'customer_phone' => '01799999999',
        ])->assertOk()->assertJsonPath('status', CheckoutStatus::Ordered->value);

        $this->assertSame('01711111111', $checkout->fresh()->customer_phone);
    }

    public function test_it_requires_a_token(): void
    {
        $this->postJson('/api/checkouts', ['customer_phone' => '01711111111'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['token']);
    }

    public function test_placing_an_order_with_the_checkout_token_marks_the_draft_recovered(): void
    {
        $checkout = AbandonedCheckout::create([
            'token' => $this->token,
            'customer_phone' => '01722222222',
            'status' => CheckoutStatus::Abandoned,
        ]);

        $this->postJson('/api/orders', [
            'customer_name' => 'Nadia',
            'customer_phone' => '01722222222',
            'checkout_token' => $this->token,
            'product_name' => 'Comfort Bra',
            'quantity' => 1,
            'unit_price' => 999,
        ])->assertCreated();

        $checkout->refresh();
        $this->assertSame(CheckoutStatus::Recovered, $checkout->status);
        $this->assertSame(Order::sole()->id, $checkout->order_id);
        $this->assertNotNull($checkout->recovered_at);
        $this->assertSame(Order::sole()->customer_id, $checkout->customer_id);
    }

    public function test_placing_an_order_also_closes_other_open_drafts_on_the_same_phone(): void
    {
        $byPhone = AbandonedCheckout::create([
            'token' => 'chk_other_device_0000000',
            'customer_phone' => '01733333333',
            'status' => CheckoutStatus::Active,
        ]);

        $this->postJson('/api/orders', [
            'customer_name' => 'Shirin',
            'customer_phone' => '01733333333',
            'product_name' => 'Comfort Bra',
            'quantity' => 1,
            'unit_price' => 999,
        ])->assertCreated();

        $this->assertSame(CheckoutStatus::Ordered, $byPhone->fresh()->status);
    }
}
