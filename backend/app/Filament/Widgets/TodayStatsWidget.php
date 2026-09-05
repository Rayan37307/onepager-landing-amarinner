<?php

namespace App\Filament\Widgets;

use App\Enums\OrderStatus;
use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TodayStatsWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $todayOrders = Order::query()->today();

        $ordersCount = (clone $todayOrders)->count();
        $revenue = (clone $todayOrders)->sum('total');
        $pending = Order::query()->whereNotIn('status', [OrderStatus::Delivered, OrderStatus::Cancelled])->count();

        return [
            Stat::make("Today's orders", $ordersCount),
            Stat::make('Revenue', '৳'.number_format($revenue)),
            Stat::make('Pending', $pending)
                ->description('Not yet delivered or cancelled')
                ->color($pending > 0 ? 'warning' : 'success'),
        ];
    }
}
