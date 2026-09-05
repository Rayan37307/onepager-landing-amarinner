<?php

namespace Tests\Feature;

use App\Filament\Widgets\CampaignPerformanceWidget;
use App\Filament\Widgets\MonthlyMarketingWidget;
use App\Filament\Widgets\RecentOrdersWidget;
use App\Filament\Widgets\TodayStatsWidget;
use App\Models\AdSpend;
use App\Models\Campaign;
use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

/**
 * Widget table/stat queries only actually execute when the Livewire
 * component is mounted (dashboard widgets lazy-load via a follow-up
 * request) — a plain `$this->get('/admin')` HTTP test does NOT exercise
 * them, so those bugs only surface in a real browser. Mount each widget
 * directly through Livewire so query bugs (e.g. invalid SQL) are caught
 * here instead.
 */
class DashboardWidgetsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->actingAs(User::factory()->create());

        $customer = Customer::create(['name' => 'Rahim', 'phone' => '01711111111']);
        $campaign = Campaign::create(['name' => 'Summer Offer', 'platform' => 'facebook']);

        AdSpend::create(['campaign_id' => $campaign->id, 'date' => now()->toDateString(), 'amount' => 100]);

        Order::create([
            'customer_id' => $customer->id,
            'product_name' => 'Glow Serum',
            'quantity' => 1,
            'unit_price' => 999,
            'campaign_id' => $campaign->id,
        ]);
    }

    public function test_today_stats_widget_renders(): void
    {
        Livewire::test(TodayStatsWidget::class)->assertOk();
    }

    public function test_monthly_marketing_widget_renders(): void
    {
        Livewire::test(MonthlyMarketingWidget::class)->assertOk();
    }

    public function test_recent_orders_widget_renders(): void
    {
        Livewire::test(RecentOrdersWidget::class)->assertOk();
    }

    public function test_campaign_performance_widget_renders(): void
    {
        Livewire::test(CampaignPerformanceWidget::class)->assertOk();
    }
}
