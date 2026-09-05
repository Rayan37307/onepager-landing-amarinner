<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Models\Campaign;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_an_order_with_a_new_customer(): void
    {
        $response = $this->postJson('/api/orders', [
            'customer_name' => 'Rahim Uddin',
            'customer_phone' => '01711111111',
            'customer_address' => '123 Gulshan Ave, Dhaka',
            'product_name' => 'Glow Serum',
            'quantity' => 2,
            'unit_price' => 999,
            'utm_source' => 'facebook',
            'utm_medium' => 'cpc',
            'utm_campaign' => 'Summer Offer',
            'fbclid' => 'abc123',
        ]);

        $response->assertCreated();
        $response->assertJsonStructure(['order_number', 'status', 'event_id']);
        $response->assertJsonPath('event_id', 'order-'.Order::first()->id);

        $this->assertDatabaseCount('orders', 1);
        $this->assertDatabaseHas('customers', ['phone' => '01711111111', 'name' => 'Rahim Uddin']);

        $order = Order::first();
        $this->assertSame(1998.0, (float) $order->total);
        $this->assertSame(OrderStatus::New, $order->status);
        $this->assertNotNull($order->order_number);
        $this->assertSame('Summer Offer', $order->campaign->name);
        $this->assertCount(1, $order->statusHistories);
    }

    public function test_it_stores_variant_colour_and_adds_shipping_fee_to_total(): void
    {
        $this->postJson('/api/orders', [
            'customer_name' => 'Nadia',
            'customer_phone' => '01722222222',
            'customer_address' => 'Mirpur, Dhaka',
            'product_name' => 'Comfort Bra',
            'variant' => '36',
            'color' => 'Skin',
            'quantity' => 2,
            'unit_price' => 1050,
            'shipping_zone' => 'outside_dhaka',
            'shipping_fee' => 120,
        ])->assertCreated();

        $order = Order::first();
        $this->assertSame('36', $order->variant);
        $this->assertSame('Skin', $order->color);
        $this->assertSame('outside_dhaka', $order->shipping_zone);
        $this->assertSame(120.0, (float) $order->shipping_fee);
        // 2 * 1050 + 120
        $this->assertSame(2220.0, (float) $order->total);
    }

    public function test_it_stores_the_meta_pixel_fbc_cookie(): void
    {
        $this->postJson('/api/orders', [
            'customer_name' => 'Shirin',
            'customer_phone' => '01733333333',
            'product_name' => 'Comfort Bra',
            'quantity' => 1,
            'unit_price' => 999,
            'fbp' => 'fb.1.1700000000.1234567890',
            'fbc' => 'fb.1.1700000000.abcdef',
        ])->assertCreated();

        $order = Order::first();
        $this->assertSame('fb.1.1700000000.1234567890', $order->fbp);
        $this->assertSame('fb.1.1700000000.abcdef', $order->fbc);
    }

    public function test_it_reuses_an_existing_customer_by_phone(): void
    {
        $customer = Customer::create(['name' => 'Old Name', 'phone' => '01899999999']);

        $this->postJson('/api/orders', [
            'customer_name' => 'New Name',
            'customer_phone' => '01899999999',
            'product_name' => 'Glow Serum',
            'quantity' => 1,
            'unit_price' => 999,
        ])->assertCreated();

        $this->assertDatabaseCount('customers', 1);
        $this->assertSame('New Name', $customer->fresh()->name);
    }

    public function test_it_reuses_an_existing_campaign_by_utm_campaign(): void
    {
        $campaign = Campaign::create(['name' => 'Retargeting', 'platform' => 'facebook']);

        $this->postJson('/api/orders', [
            'customer_name' => 'Karim',
            'customer_phone' => '01888888888',
            'product_name' => 'Glow Serum',
            'quantity' => 1,
            'unit_price' => 999,
            'utm_campaign' => 'Retargeting',
        ])->assertCreated();

        $this->assertDatabaseCount('campaigns', 1);
        $this->assertSame($campaign->id, Order::first()->campaign_id);
    }

    public function test_it_validates_required_fields(): void
    {
        $this->postJson('/api/orders', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['customer_name', 'customer_phone', 'product_name', 'quantity', 'unit_price']);
    }
}
