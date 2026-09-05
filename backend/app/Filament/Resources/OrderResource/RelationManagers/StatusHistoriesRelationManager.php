<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use App\Enums\OrderStatus;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class StatusHistoriesRelationManager extends RelationManager
{
    protected static string $relationship = 'statusHistories';

    protected static ?string $title = 'Status history';

    public function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('status')
            ->defaultSort('changed_at', 'asc')
            ->columns([
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (OrderStatus $state) => $state->color())
                    ->formatStateUsing(fn (OrderStatus $state) => $state->label()),
                Tables\Columns\TextColumn::make('changed_at')->dateTime(),
                Tables\Columns\TextColumn::make('note')->placeholder('—'),
                Tables\Columns\TextColumn::make('user.name')->label('Changed by')->placeholder('System / customer'),
            ])
            ->headerActions([])
            ->actions([])
            ->bulkActions([]);
    }
}
