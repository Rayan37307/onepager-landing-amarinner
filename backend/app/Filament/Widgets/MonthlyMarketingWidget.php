<?php

namespace App\Filament\Widgets;

use App\Enums\OrderStatus;
use App\Models\AdSpend;
use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class MonthlyMarketingWidget extends BaseWidget
{
    protected static ?int $sort = 3;

    protected function getHeading(): ?string
    {
        return 'This month';
    }

    protected function getStats(): array
    {
        $thisMonth = Order::query()->thisMonth();

        $orders = (clone $thisMonth)->count();
        $confirmed = (clone $thisMonth)->whereIn('status', [
            OrderStatus::Confirmed, OrderStatus::Shipped, OrderStatus::Delivered,
        ])->count();
        $delivered = (clone $thisMonth)->status(OrderStatus::Delivered)->count();
        $revenue = (clone $thisMonth)->sum('total');

        $adSpend = AdSpend::query()->whereBetween('date', [
            Carbon::now()->startOfMonth()->toDateString(),
            Carbon::now()->toDateString(),
        ])->sum('amount');

        $costPerOrder = $orders > 0 ? $adSpend / $orders : 0;
        $costPerConfirmed = $confirmed > 0 ? $adSpend / $confirmed : 0;

        return [
            Stat::make('Orders', $orders),
            Stat::make('Confirmed', $confirmed),
            Stat::make('Delivered', $delivered),
            Stat::make('Revenue', '৳'.number_format($revenue)),
            Stat::make('Ad spend', '৳'.number_format($adSpend)),
            Stat::make('Cost / order', '৳'.number_format($costPerOrder)),
            Stat::make('Cost / confirmed', '৳'.number_format($costPerConfirmed)),
        ];
    }
}
