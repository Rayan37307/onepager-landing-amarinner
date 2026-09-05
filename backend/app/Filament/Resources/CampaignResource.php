<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CampaignResource\Pages;
use App\Filament\Resources\CampaignResource\RelationManagers;
use App\Models\Campaign;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class CampaignResource extends Resource
{
    protected static ?string $model = Campaign::class;

    protected static ?string $navigationIcon = 'heroicon-o-megaphone';

    protected static ?string $navigationGroup = 'Marketing';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required(),
                Forms\Components\Select::make('platform')
                    ->options([
                        'facebook' => 'Facebook',
                        'tiktok' => 'TikTok',
                        'google' => 'Google',
                        'other' => 'Other',
                    ])
                    ->default('facebook')
                    ->required(),
                Forms\Components\TextInput::make('external_id')
                    ->label('Ad platform campaign ID'),
                Forms\Components\Toggle::make('is_active')
                    ->default(true)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query
                ->withCount('orders')
                ->withSum('orders', 'total')
                ->withSum(['adSpends' => fn ($q) => $q->whereBetween('date', [
                    Carbon::now()->startOfMonth()->toDateString(),
                    Carbon::now()->toDateString(),
                ])], 'amount'))
            ->defaultSort('orders_count', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('platform')
                    ->badge(),
                Tables\Columns\TextColumn::make('orders_count')
                    ->label('Orders (this month)'),
                Tables\Columns\TextColumn::make('orders_sum_total')
                    ->label('Revenue')
                    ->formatStateUsing(fn ($state) => '৳'.number_format($state ?? 0)),
                Tables\Columns\TextColumn::make('ad_spends_sum_amount')
                    ->label('Ad spend (this month)')
                    ->formatStateUsing(fn ($state) => '৳'.number_format($state ?? 0)),
                Tables\Columns\TextColumn::make('cost_per_order')
                    ->label('Cost / order')
                    ->state(fn ($record) => $record->orders_count > 0
                        ? '৳'.number_format(($record->ad_spends_sum_amount ?? 0) / $record->orders_count, 0)
                        : '—'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\AdSpendsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCampaigns::route('/'),
            'create' => Pages\CreateCampaign::route('/create'),
            'view' => Pages\ViewCampaign::route('/{record}'),
            'edit' => Pages\EditCampaign::route('/{record}/edit'),
        ];
    }
}
