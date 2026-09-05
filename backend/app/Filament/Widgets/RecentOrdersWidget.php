<?php

namespace App\Filament\Widgets;

use App\Enums\OrderStatus;
use App\Filament\Resources\OrderResource;
use App\Models\Order;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentOrdersWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    protected function getTableHeading(): ?string
    {
        return 'Recent orders';
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(Order::query()->with('customer')->latest())
            ->paginated([5, 10, 25])
            ->defaultPaginationPageOption(5)
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->label('Order')
                    ->formatStateUsing(fn ($state) => "#{$state}")
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('customer.name')->label('Customer'),
                Tables\Columns\TextColumn::make('customer.phone')->label('Phone'),
                Tables\Columns\TextColumn::make('total')->formatStateUsing(fn ($state) => '৳'.number_format($state)),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (OrderStatus $state) => $state->color())
                    ->formatStateUsing(fn (OrderStatus $state) => $state->label()),
                Tables\Columns\TextColumn::make('created_at')->since()->label('Placed'),
            ])
            ->actions([
                Tables\Actions\Action::make('view')
                    ->label('View')
                    ->url(fn (Order $record) => OrderResource::getUrl('view', ['record' => $record])),
            ]);
    }
}
