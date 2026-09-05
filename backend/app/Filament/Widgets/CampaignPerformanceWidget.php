<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\CampaignResource;
use App\Models\Campaign;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class CampaignPerformanceWidget extends BaseWidget
{
    protected static ?int $sort = 4;

    protected int|string|array $columnSpan = 'full';

    protected function getTableHeading(): ?string
    {
        return 'Campaign performance — this month';
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Campaign::query()
                    ->whereHas('orders', fn (Builder $q) => $q->thisMonth())
                    ->withCount(['orders' => fn (Builder $q) => $q->thisMonth()])
                    ->withSum(['orders as orders_sum_total' => fn (Builder $q) => $q->thisMonth()], 'total')
                    ->withSum(['adSpends' => fn (Builder $q) => $q->whereBetween('date', [
                        Carbon::now()->startOfMonth()->toDateString(),
                        Carbon::now()->toDateString(),
                    ])], 'amount')
                    ->orderByDesc('orders_count')
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Campaign')
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('orders_count')
                    ->label('Orders'),
                Tables\Columns\TextColumn::make('orders_sum_total')
                    ->label('Revenue')
                    ->formatStateUsing(fn ($state) => '৳'.number_format($state ?? 0)),
                Tables\Columns\TextColumn::make('ad_spends_sum_amount')
                    ->label('Ad spend')
                    ->formatStateUsing(fn ($state) => '৳'.number_format($state ?? 0)),
                Tables\Columns\TextColumn::make('cost_per_order')
                    ->label('Cost / order')
                    ->state(fn ($record) => $record->orders_count > 0
                        ? '৳'.number_format(($record->ad_spends_sum_amount ?? 0) / $record->orders_count, 0)
                        : '—'),
            ])
            ->actions([
                Tables\Actions\Action::make('view')
                    ->label('View')
                    ->url(fn (Campaign $record) => CampaignResource::getUrl('view', ['record' => $record])),
            ])
            ->paginated(false);
    }
}
