<?php

namespace Tests\Feature;

use App\Enums\CheckoutStatus;
use App\Models\AbandonedCheckout;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SweepAbandonedCheckoutsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_marks_stale_active_checkouts_as_abandoned(): void
    {
        $stale = AbandonedCheckout::create([
            'token' => 'chk_stale_000000000000',
            'customer_phone' => '01711111111',
            'status' => CheckoutStatus::Active,
            'last_activity_at' => now()->subHour(),
        ]);

        $fresh = AbandonedCheckout::create([
            'token' => 'chk_fresh_000000000000',
            'customer_phone' => '01722222222',
            'status' => CheckoutStatus::Active,
            'last_activity_at' => now()->subMinutes(5),
        ]);

        $ordered = AbandonedCheckout::create([
            'token' => 'chk_ordered_00000000000',
            'customer_phone' => '01733333333',
            'status' => CheckoutStatus::Ordered,
            'last_activity_at' => now()->subDay(),
        ]);

        $this->artisan('checkouts:sweep', ['--minutes' => 30])
            ->assertSuccessful();

        $this->assertSame(CheckoutStatus::Abandoned, $stale->fresh()->status);
        $this->assertSame(CheckoutStatus::Active, $fresh->fresh()->status);
        $this->assertSame(CheckoutStatus::Ordered, $ordered->fresh()->status);
    }
}
