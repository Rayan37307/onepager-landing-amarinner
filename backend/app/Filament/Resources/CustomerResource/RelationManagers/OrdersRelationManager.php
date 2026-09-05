<?php

namespace App\Filament\Resources\CustomerResource\RelationManagers;

use App\Enums\OrderStatus;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class OrdersRelationManager extends RelationManager
{
    protected static string $relationship = 'orders';

    public function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('order_number')
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('order_number')->formatStateUsing(fn ($state) => "#{$state}"),
                Tables\Columns\TextColumn::make('product_name'),
                Tables\Columns\TextColumn::make('total')->formatStateUsing(fn ($state) => '৳'.number_format($state)),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (OrderStatus $state) => $state->color())
                    ->formatStateUsing(fn (OrderStatus $state) => $state->label()),
                Tables\Columns\TextColumn::make('created_at')->dateTime(),
            ])
            ->headerActions([])
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->url(fn ($record) => \App\Filament\Resources\OrderResource::getUrl('view', ['record' => $record])),
            ])
            ->bulkActions([]);
    }
}
