<?php

namespace App\Filament\Resources;

use App\Enums\OrderStatus;
use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Campaign;
use App\Models\Customer;
use App\Models\Order;
use App\Services\MetaConversionsApiService;
use App\Support\UserAgent;
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
        $money = fn ($state) => '৳'.number_format((float) $state, 2);

        return $infolist->schema([
            Infolist\Section::make('Order information')
                ->columns(4)
                ->schema([
                    Infolist\TextEntry::make('order_number')->label('Order ID')->formatStateUsing(fn ($state) => "#{$state}")->copyable(),
                    Infolist\TextEntry::make('status')
                        ->badge()
                        ->color(fn (OrderStatus $state) => $state->color())
                        ->formatStateUsing(fn (OrderStatus $state) => $state->label()),
                    Infolist\TextEntry::make('created_at')->label('Order date & time')->dateTime('d M Y, h:i A'),
                    Infolist\TextEntry::make('product_name')->label('Product'),
                    Infolist\TextEntry::make('variant')->label('Size')->placeholder('—'),
                    Infolist\TextEntry::make('quantity'),
                    Infolist\TextEntry::make('unit_price')->label('Product price')->formatStateUsing($money),
                    Infolist\TextEntry::make('shipping_fee')->label('Delivery charge')->formatStateUsing($money),
                    Infolist\TextEntry::make('total')->label('Total')->formatStateUsing($money)->weight('bold'),
                    Infolist\TextEntry::make('color')->label('Colour')->placeholder('—')
                        ->visible(fn (Order $record) => filled($record->color)),
                    Infolist\TextEntry::make('notes')->placeholder('—')->columnSpanFull(),
                ]),

            Infolist\Section::make('Customer information')
                ->columns(4)
                ->schema([
                    Infolist\TextEntry::make('customer.name')->label('Name'),
                    Infolist\TextEntry::make('customer.phone')->label('Phone')->copyable(),
                    Infolist\TextEntry::make('district')
                        ->label('District')
                        // Older orders only have the district inside shipping_zone.
                        ->state(fn (Order $record) => $record->district ?? $record->shipping_zone)
                        ->placeholder('—'),
                    Infolist\TextEntry::make('customer.address')->label('Address')->placeholder('—'),
                    Infolist\TextEntry::make('previous_orders')
                        ->label('Previous orders')
                        ->state(fn (Order $record) => $record->customer?->orders()->whereKeyNot($record->getKey())->count() ?? 0),
                    Infolist\TextEntry::make('confirmed_orders')
                        ->label('Confirmed orders')
                        ->state(fn (Order $record) => self::customerOrdersWithStatus($record, OrderStatus::Confirmed)),
                    Infolist\TextEntry::make('cancelled_orders')
                        ->label('Cancelled orders')
                        ->state(fn (Order $record) => self::customerOrdersWithStatus($record, OrderStatus::Cancelled))
                        ->color(fn ($state) => $state > 0 ? 'danger' : null),
                    Infolist\TextEntry::make('delivered_orders')
                        ->label('Delivered orders')
                        ->state(fn (Order $record) => self::customerOrdersWithStatus($record, OrderStatus::Delivered))
                        ->color(fn ($state) => $state > 0 ? 'success' : null),
                ]),

            Infolist\Section::make('Ad source')
                ->columns(3)
                ->schema([
                    Infolist\TextEntry::make('source')
                        ->label('Source')
                        ->state(fn (Order $record) => $record->trafficSource())
                        ->badge()
                        ->color(fn ($state) => match ($state) {
                            'Facebook' => 'info',
                            'Direct' => 'gray',
                            default => 'warning',
                        }),
                    Infolist\TextEntry::make('campaign_name')
                        ->label('Campaign name')
                        ->state(fn (Order $record) => $record->campaign?->name ?? $record->utm_campaign)
                        ->placeholder('—'),
                    // Meta's default URL parameters put the ad set name in
                    // utm_term and the ad name in utm_content — fall back to them.
                    Infolist\TextEntry::make('adset_name')
                        ->label('Ad set name')
                        ->state(fn (Order $record) => $record->adset_name ?? $record->utm_term)
                        ->placeholder('—'),
                    Infolist\TextEntry::make('ad_name')
                        ->label('Ad / hook name')
                        ->state(fn (Order $record) => $record->ad_name ?? $record->utm_content ?? $record->ad_identifier)
                        ->placeholder('—'),
                    Infolist\TextEntry::make('placement')->placeholder('—'),
                    Infolist\TextEntry::make('landing_page')
                        ->label('Landing page')
                        ->placeholder('—')
                        ->limit(60)
                        ->tooltip(fn (Order $record) => $record->landing_page)
                        ->url(fn (Order $record) => $record->landing_page, shouldOpenInNewTab: true),
                ]),

            Infolist\Section::make('Visitor information')
                ->columns(3)
                ->schema([
                    Infolist\TextEntry::make('device')->label('Device')
                        ->state(fn (Order $record) => UserAgent::parse($record->user_agent)->device()),
                    Infolist\TextEntry::make('os')->label('OS')
                        ->state(fn (Order $record) => UserAgent::parse($record->user_agent)->os()),
                    Infolist\TextEntry::make('browser')->label('Browser')
                        ->state(fn (Order $record) => UserAgent::parse($record->user_agent)->browser()),
                    Infolist\TextEntry::make('ip_address')->label('IP address')->placeholder('—')->copyable(),
                    Infolist\TextEntry::make('session_id')->label('Session ID')->placeholder('—')->copyable(),
                    Infolist\TextEntry::make('time_to_order_seconds')
                        ->label('Time spent before order')
                        ->placeholder('—')
                        ->formatStateUsing(fn (?int $state) => $state === null ? null : self::formatDuration($state)),
                    Infolist\TextEntry::make('same_session_orders')
                        ->label('Same session orders')
                        ->state(fn (Order $record) => $record->siblingOrdersCount('session_id'))
                        ->color(fn ($state) => $state > 0 ? 'warning' : null),
                    Infolist\TextEntry::make('same_ip_orders')
                        ->label('Same IP orders')
                        ->state(fn (Order $record) => $record->siblingOrdersCount('ip_address'))
                        ->color(fn ($state) => $state > 0 ? 'warning' : null),
                    Infolist\TextEntry::make('same_phone_orders')
                        ->label('Previous orders from same phone')
                        ->state(fn (Order $record) => $record->customer?->orders()
                            ->whereKeyNot($record->getKey())
                            ->where('created_at', '<=', $record->created_at)
                            ->count() ?? 0),
                ]),

            Infolist\Section::make('Status history')
                ->columns(5)
                ->schema(collect([
                    OrderStatus::New,
                    OrderStatus::Confirmed,
                    OrderStatus::Shipped,
                    OrderStatus::Delivered,
                    OrderStatus::Cancelled,
                ])->map(fn (OrderStatus $status) => Infolist\TextEntry::make('history_'.$status->value)
                    ->label($status->label())
                    ->state(fn (Order $record) => $record->reachedStatusAt($status))
                    ->dateTime('d M Y, h:i A')
                    ->placeholder('—')
                    ->color(fn ($state) => $state ? $status->color() : null)
                )->all()),

            Infolist\Section::make('Technical details')
                ->columns(3)
                ->collapsible()
                ->collapsed()
                ->schema([
                    Infolist\TextEntry::make('fb_campaign_id')->label('Campaign ID')->placeholder('—')->copyable(),
                    Infolist\TextEntry::make('fb_adset_id')->label('Ad set ID')->placeholder('—')->copyable(),
                    Infolist\TextEntry::make('fb_ad_id')->label('Ad ID')->placeholder('—')->copyable(),
                    Infolist\TextEntry::make('fbclid')->label('fbclid')->placeholder('—')->copyable()->limit(40),
                    Infolist\TextEntry::make('fbp')->label('fbp')->placeholder('—')->copyable(),
                    Infolist\TextEntry::make('fbc')->label('fbc')->placeholder('—')->copyable()->limit(40),
                    Infolist\TextEntry::make('capi_event_id')
                        ->label('CAPI event ID')
                        ->state(fn (Order $record) => MetaConversionsApiService::purchaseEventId($record))
                        ->copyable(),
                    Infolist\TextEntry::make('capi_sent_at')->label('CAPI sent time')->dateTime('d M Y, h:i:s A')->placeholder('Not sent'),
                    Infolist\TextEntry::make('referrer')->label('Referrer')->placeholder('—')->limit(60),
                    Infolist\TextEntry::make('utm_source')->label('utm_source')->placeholder('—'),
                    Infolist\TextEntry::make('utm_medium')->label('utm_medium')->placeholder('—'),
                    Infolist\TextEntry::make('utm_campaign')->label('utm_campaign')->placeholder('—'),
                    Infolist\TextEntry::make('utm_content')->label('utm_content')->placeholder('—'),
                    Infolist\TextEntry::make('utm_term')->label('utm_term')->placeholder('—'),
                    Infolist\TextEntry::make('user_agent')->label('User agent')->placeholder('—')->columnSpanFull(),
                ]),
        ]);
    }

    /**
     * How many of this customer's other orders currently sit in a status.
     */
    private static function customerOrdersWithStatus(Order $record, OrderStatus $status): int
    {
        return $record->customer?->orders()
            ->whereKeyNot($record->getKey())
            ->where('status', $status)
            ->count() ?? 0;
    }

    private static function formatDuration(int $seconds): string
    {
        $h = intdiv($seconds, 3600);
        $m = intdiv($seconds % 3600, 60);
        $s = $seconds % 60;

        return collect([$h ? "{$h}h" : null, $m ? "{$m}m" : null, "{$s}s"])->filter()->implode(' ');
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
