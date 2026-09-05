<?php

namespace App\Filament\Resources;

use App\Enums\OrderStatus;
use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Campaign;
use App\Models\Customer;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists\Components as Infolist;
use Filament\Infolists\Infolist as InfolistSchema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationGroup = 'CRM';

    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        return (string) Order::query()->status(OrderStatus::New)->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return Order::query()->status(OrderStatus::New)->count() > 0 ? 'warning' : 'gray';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Customer')
                ->columns(2)
                ->schema([
                    Forms\Components\Select::make('customer_id')
                        ->relationship('customer', 'name')
                        ->searchable()
                        ->preload()
                        ->required()
                        ->createOptionForm([
                            Forms\Components\TextInput::make('name')->required(),
                            Forms\Components\TextInput::make('phone')->required(),
                            Forms\Components\Textarea::make('address'),
                        ]),
                ]),

            Forms\Components\Section::make('Order')
                ->columns(3)
                ->schema([
                    Forms\Components\TextInput::make('product_name')
                        ->required()
                        ->columnSpan(2),
                    Forms\Components\Select::make('status')
                        ->options(OrderStatus::options())
                        ->required()
                        ->default(OrderStatus::New->value),
                    Forms\Components\TextInput::make('variant')
                        ->label('Size / variant')
                        ->maxLength(255),
                    Forms\Components\TextInput::make('color')
                        ->label('Colour')
                        ->maxLength(255),
                    Forms\Components\TextInput::make('quantity')
                        ->required()
                        ->numeric()
                        ->minValue(1)
                        ->default(1),
                    Forms\Components\TextInput::make('unit_price')
                        ->label('Unit price (৳)')
                        ->required()
                        ->numeric()
                        ->minValue(0),
                    Forms\Components\TextInput::make('shipping_zone')
                        ->label('Delivery zone')
                        ->maxLength(255),
                    Forms\Components\TextInput::make('shipping_fee')
                        ->label('Delivery fee (৳)')
                        ->numeric()
                        ->minValue(0)
                        ->default(0),
                    Forms\Components\Textarea::make('notes')
                        ->columnSpanFull(),
                ]),

            Forms\Components\Section::make('Ad attribution')
                ->description('Populated automatically from the landing page. Edit only to correct.')
                ->columns(2)
                ->collapsed()
                ->schema([
                    Forms\Components\Select::make('campaign_id')
                        ->relationship('campaign', 'name')
                        ->searchable()
                        ->preload()
                        ->createOptionForm([
                            Forms\Components\TextInput::make('name')->required(),
                            Forms\Components\TextInput::make('platform')->default('facebook'),
                        ]),
                    Forms\Components\TextInput::make('ad_identifier')->label('Ad / content identifier'),
                    Forms\Components\TextInput::make('utm_source'),
                    Forms\Components\TextInput::make('utm_medium'),
                    Forms\Components\TextInput::make('utm_campaign'),
                    Forms\Components\TextInput::make('utm_content'),
                    Forms\Components\TextInput::make('utm_term'),
                    Forms\Components\TextInput::make('fbclid')->label('Facebook click ID (fbclid)'),
                    Forms\Components\TextInput::make('fbp')->label('Facebook browser ID (fbp)'),
                ]),
        ]);
    }

    public static function infolist(InfolistSchema $infolist): InfolistSchema
    {
        return $infolist->schema([
            Infolist\Section::make('Order')
                ->columns(4)
                ->schema([
                    Infolist\TextEntry::make('order_number')->label('Order ID')->formatStateUsing(fn ($state) => "#{$state}"),
                    Infolist\TextEntry::make('status')
                        ->badge()
                        ->color(fn (OrderStatus $state) => $state->color())
                        ->formatStateUsing(fn (OrderStatus $state) => $state->label()),
                    Infolist\TextEntry::make('created_at')->label('Order time')->dateTime(),
                    Infolist\TextEntry::make('total')->label('Total')->formatStateUsing(fn ($state) => '৳'.number_format($state, 2)),

                    Infolist\TextEntry::make('product_name')->label('Product'),
                    Infolist\TextEntry::make('variant')->label('Size')->placeholder('—'),
                    Infolist\TextEntry::make('color')->label('Colour')->placeholder('—'),
                    Infolist\TextEntry::make('quantity'),
                    Infolist\TextEntry::make('unit_price')->formatStateUsing(fn ($state) => '৳'.number_format($state, 2)),
                    Infolist\TextEntry::make('shipping_zone')->label('Delivery zone')->placeholder('—'),
                    Infolist\TextEntry::make('shipping_fee')->label('Delivery fee')->formatStateUsing(fn ($state) => '৳'.number_format($state, 2)),
                    Infolist\TextEntry::make('notes')->placeholder('—')->columnSpanFull(),
                ]),

            Infolist\Section::make('Customer')
                ->columns(3)
                ->schema([
                    Infolist\TextEntry::make('customer.name')->label('Name'),
                    Infolist\TextEntry::make('customer.phone')->label('Phone')->copyable(),
                    Infolist\TextEntry::make('customer.address')->label('Address')->columnSpanFull()->placeholder('—'),
                ]),

            Infolist\Section::make('Ad attribution')
                ->columns(3)
                ->schema([
                    Infolist\TextEntry::make('campaign.name')->label('Campaign')->placeholder('— organic / direct —'),
                    Infolist\TextEntry::make('ad_identifier')->label('Ad / content identifier')->placeholder('—'),
                    Infolist\TextEntry::make('utm_source')->placeholder('—'),
                    Infolist\TextEntry::make('utm_medium')->placeholder('—'),
                    Infolist\TextEntry::make('utm_campaign')->placeholder('—'),
                    Infolist\TextEntry::make('utm_content')->placeholder('—'),
                    Infolist\TextEntry::make('utm_term')->placeholder('—'),
                    Infolist\TextEntry::make('fbclid')->label('fbclid')->placeholder('—')->copyable(),
                    Infolist\TextEntry::make('fbp')->label('fbp')->placeholder('—')->copyable(),
                    Infolist\TextEntry::make('ip_address')->placeholder('—'),
                    Infolist\TextEntry::make('capi_sent_at')->label('Sent to Meta CAPI')->dateTime()->placeholder('Not sent'),
                    Infolist\TextEntry::make('user_agent')->placeholder('—')->columnSpanFull(),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->label('Order')
                    ->formatStateUsing(fn ($state) => "#{$state}")
                    ->searchable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('customer.name')
                    ->label('Customer')
                    ->searchable(),
                Tables\Columns\TextColumn::make('customer.phone')
                    ->label('Phone')
                    ->searchable(),
                Tables\Columns\TextColumn::make('product_name')
                    ->label('Product')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('total')
                    ->formatStateUsing(fn ($state) => '৳'.number_format($state))
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (OrderStatus $state) => $state->color())
                    ->formatStateUsing(fn (OrderStatus $state) => $state->label()),
                Tables\Columns\TextColumn::make('campaign.name')
                    ->label('Campaign')
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Placed')
                    ->since()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(OrderStatus::options()),
                Tables\Filters\SelectFilter::make('campaign_id')
                    ->label('Campaign')
                    ->relationship('campaign', 'name'),
                Tables\Filters\Filter::make('today')
                    ->query(fn (Builder $query) => $query->today())
                    ->toggle(),
                Tables\Filters\Filter::make('this_month')
                    ->query(fn (Builder $query) => $query->thisMonth())
                    ->toggle(),
            ])
            ->actions([
                Tables\Actions\ActionGroup::make(
                    collect(OrderStatus::cases())->map(
                        fn (OrderStatus $status) => Tables\Actions\Action::make('status_'.$status->value)
                            ->label($status->label())
                            ->color($status->color())
                            ->visible(fn (Order $record) => in_array($status, $record->status->nextStatuses(), true))
                            ->requiresConfirmation()
                            ->action(fn (Order $record) => $record->transitionTo($status))
                    )->all()
                )
                    ->label('Advance status')
                    ->icon('heroicon-o-arrow-path')
                    ->button()
                    ->color('gray')
                    ->visible(fn (Order $record) => ! $record->status->isTerminal()),
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
            RelationManagers\StatusHistoriesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'view' => Pages\ViewOrder::route('/{record}'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
