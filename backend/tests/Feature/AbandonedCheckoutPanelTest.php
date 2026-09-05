<?php

namespace Tests\Feature;

use App\Enums\CheckoutStatus;
use App\Filament\Resources\AbandonedCheckoutResource\Pages\ListAbandonedCheckouts;
use App\Filament\Widgets\AbandonedCheckoutStatsWidget;
use App\Models\AbandonedCheckout;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class AbandonedCheckoutPanelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->actingAs(User::factory()->create());
    }

    public function test_abandoned_checkout_pages_load(): void
    {
        $checkout = AbandonedCheckout::create([
            'token' => 'chk_panel_00000000000000',
            'customer_name' => 'Rahim',
            'customer_phone' => '01711111111',
            'product_name' => 'Comfort Bra',
            'quantity' => 2,
            'unit_price' => 999,
            'status' => CheckoutStatus::Abandoned,
        ]);

        $this->get('/admin/abandoned-checkouts')->assertOk();
        $this->get("/admin/abandoned-checkouts/{$checkout->id}")->assertOk();
        $this->get("/admin/abandoned-checkouts/{$checkout->id}/edit")->assertOk();
    }

    public function test_stats_widget_renders(): void
    {
        AbandonedCheckout::create([
            'token' => 'chk_widget_0000000000000',
            'customer_phone' => '01711111111',
            'unit_price' => 999,
            'quantity' => 1,
            'status' => CheckoutStatus::Abandoned,
        ]);

        Livewire::test(AbandonedCheckoutStatsWidget::class)->assertOk();
    }

    public function test_convert_action_creates_an_order_and_closes_the_checkout(): void
    {
        $checkout = AbandonedCheckout::create([
            'token' => 'chk_convert_000000000000',
            'customer_name' => 'Nadia',
            'customer_phone' => '01722222222',
            'product_name' => 'Comfort Bra',
            'variant' => '36',
            'quantity' => 2,
            'unit_price' => 999,
            'shipping_fee' => 60,
            'status' => CheckoutStatus::Abandoned,
        ]);

        Livewire::test(ListAbandonedCheckouts::class)
            ->callTableAction('convert', $checkout, data: [
                'customer_name' => 'Nadia',
                'customer_phone' => '01722222222',
                'customer_address' => 'Mirpur, Dhaka',
                'quantity' => 2,
                'unit_price' => 999,
                'shipping_fee' => 60,
            ])
            ->assertHasNoTableActionErrors();

        $order = Order::sole();
        $this->assertSame(2058.0, (float) $order->total); // 2 * 999 + 60
        $this->assertSame('36', $order->variant);

        $checkout->refresh();
        $this->assertSame(CheckoutStatus::Recovered, $checkout->status);
        $this->assertSame($order->id, $checkout->order_id);
    }
}
