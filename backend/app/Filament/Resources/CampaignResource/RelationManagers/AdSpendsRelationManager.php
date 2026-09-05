<?php

namespace App\Filament\Resources\CampaignResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class AdSpendsRelationManager extends RelationManager
{
    protected static string $relationship = 'adSpends';

    protected static ?string $title = 'Daily ad spend';

    public function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\DatePicker::make('date')->required(),
            Forms\Components\TextInput::make('amount')
                ->label('Amount (৳)')
                ->numeric()
                ->required(),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('date')
            ->defaultSort('date', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('date')->date(),
                Tables\Columns\TextColumn::make('amount')->formatStateUsing(fn ($state) => '৳'.number_format($state, 2)),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
