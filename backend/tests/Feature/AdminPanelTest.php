<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
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

    public function test_order_view_shows_customer_visitor_and_history_details(): void
    {
        $this->actingAs(User::factory()->create());

        $customer = Customer::create(['name' => 'Rahim', 'phone' => '01711111111']);
        $base = [
            'customer_id' => $customer->id,
            'product_name' => 'Glow Serum',
            'quantity' => 1,
            'unit_price' => 999,
            'ip_address' => '103.1.1.1',
            'session_id' => 'sess-1',
        ];

        Order::create($base)->transitionTo(OrderStatus::Cancelled);
        $order = Order::create([
            ...$base,
            'district' => 'ঢাকা',
            'ad_name' => 'Hook A',
            'fb_ad_id' => '999888777',
            'time_to_order_seconds' => 125,
            'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1',
        ]);
        $order->transitionTo(OrderStatus::Called);
        $order->transitionTo(OrderStatus::Confirmed);

        $this->get("/admin/orders/{$order->id}")
            ->assertOk()
            ->assertSeeInOrder(['Order information', 'Customer information', 'Ad source', 'Visitor information', 'Status history', 'Technical details'])
            ->assertSee('ঢাকা')
            ->assertSee('Hook A')
            ->assertSee('999888777')
            ->assertSee('Facebook')
            ->assertSee('Mobile')
            ->assertSee('iOS 17.5')
            ->assertSee('Safari 17')
            ->assertSee('2m 5s')
            ->assertSee('order-'.$order->id);
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
