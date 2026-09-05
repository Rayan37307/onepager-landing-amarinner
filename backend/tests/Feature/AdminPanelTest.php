<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_dashboard_loads(): void
    {
        $this->actingAs(User::factory()->create());

        $this->get('/admin')->assertOk();
    }

    public function test_orders_list_and_view_pages_load(): void
    {
        $this->actingAs(User::factory()->create());

        $customer = Customer::create(['name' => 'Rahim', 'phone' => '01711111111']);
        $campaign = Campaign::create(['name' => 'Summer Offer', 'platform' => 'facebook']);
        $order = Order::create([
            'customer_id' => $customer->id,
            'product_name' => 'Glow Serum',
            'quantity' => 1,
            'unit_price' => 999,
            'campaign_id' => $campaign->id,
            'utm_source' => 'facebook',
            'fbclid' => 'abc123',
        ]);

        $this->get('/admin/orders')->assertOk();
        $this->get("/admin/orders/{$order->id}")->assertOk();
        $this->get("/admin/orders/{$order->id}/edit")->assertOk();
    }

    public function test_customers_and_campaigns_pages_load(): void
    {
        $this->actingAs(User::factory()->create());

        $customer = Customer::create(['name' => 'Rahim', 'phone' => '01711111111']);
        $campaign = Campaign::create(['name' => 'Summer Offer', 'platform' => 'facebook']);

        $this->get('/admin/customers')->assertOk();
        $this->get("/admin/customers/{$customer->id}")->assertOk();
        $this->get('/admin/campaigns')->assertOk();
        $this->get("/admin/campaigns/{$campaign->id}")->assertOk();
    }
}
