<?php

namespace App\Filament\Widgets;

use App\Enums\CheckoutStatus;
use App\Models\AbandonedCheckout;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AbandonedCheckoutStatsWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected function getStats(): array
    {
        $open = AbandonedCheckout::query()->recoverable();

        $openCount = (clone $open)->count();
        $openValue = (clone $open)->sum('total');

        // Recovery rate: of the checkouts that ever went cold, how many came
        // back as an order?
        $abandonedEver = AbandonedCheckout::query()
            ->whereIn('status', [CheckoutStatus::Abandoned, CheckoutStatus::Recovered, CheckoutStatus::Lost])
            ->count();
        $recovered = AbandonedCheckout::query()->status(CheckoutStatus::Recovered)->count();
        $rate = $abandonedEver > 0 ? round($recovered / $abandonedEver * 100) : 0;

        return [
            Stat::make('Abandoned checkouts', $openCount)
                ->description('With a phone number to call')
                ->color($openCount > 0 ? 'warning' : 'success'),
            Stat::make('Recoverable value', '৳'.number_format($openValue))
                ->description('Cart total still in play'),
            Stat::make('Recovery rate', $rate.'%')
                ->description("{$recovered} of {$abandonedEver} cold checkouts converted")
                ->color($rate >= 20 ? 'success' : 'gray'),
        ];
    }
}
