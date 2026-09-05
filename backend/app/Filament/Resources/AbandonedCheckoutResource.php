<?php

namespace App\Filament\Resources;

use App\Enums\CheckoutStatus;
use App\Enums\OrderStatus;
use App\Filament\Resources\AbandonedCheckoutResource\Pages;
use App\Models\AbandonedCheckout;
use App\Models\Customer;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists\Components as Infolist;
use Filament\Infolists\Infolist as InfolistSchema;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class AbandonedCheckoutResource extends Resource
{
    protected static ?string $model = AbandonedCheckout::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';

    protected static ?string $navigationGroup = 'CRM';

    protected static ?int $navigationSort = 3;

    protected static ?string $navigationLabel = 'Abandoned checkouts';

    protected static ?string $modelLabel = 'abandoned checkout';

    public static function getNavigationBadge(): ?string
    {
        return (string) AbandonedCheckout::query()->recoverable()->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return AbandonedCheckout::query()->recoverable()->count() > 0 ? 'warning' : 'gray';
    }

    public static function form(Form $form): Form
    {
        // Drafts are created by the landing page — the only things worth
        // editing by hand are the follow-up status and a note.
        return $form->schema([
            Forms\Components\Section::make('Follow-up')
                ->columns(2)
                ->schema([
                    Forms\Components\Select::make('status')
                        ->options(CheckoutStatus::options())
                        ->required(),
                    Forms\Components\Textarea::make('notes')
                        ->rows(3)
                        ->columnSpanFull(),
                ]),
        ]);
    }

    public static function infolist(InfolistSchema $infolist): InfolistSchema
    {
        return $infolist->schema([
            Infolist\Section::make('Contact')
                ->columns(3)
                ->schema([
                    Infolist\TextEntry::make('customer_name')->label('Name')->placeholder('— not entered —'),
                    Infolist\TextEntry::make('customer_phone')->label('Phone')->copyable()->placeholder('— not entered —'),
                    Infolist\TextEntry::make('status')
                        ->badge()
                        ->color(fn (CheckoutStatus $state) => $state->color())
                        ->formatStateUsing(fn (CheckoutStatus $state) => $state->label()),
                    Infolist\TextEntry::make('customer_address')->label('Address')->columnSpanFull()->placeholder('— not entered —'),
                ]),

            Infolist\Section::make('Cart')
                ->columns(4)
                ->schema([
                    Infolist\TextEntry::make('product_name')->label('Product')->placeholder('—'),
                    Infolist\TextEntry::make('variant')->label('Size')->placeholder('—'),
                    Infolist\TextEntry::make('color')->label('Colour')->placeholder('—'),
                    Infolist\TextEntry::make('quantity'),
                    Infolist\TextEntry::make('unit_price')->formatStateUsing(fn ($state) => '৳'.number_format($state, 2)),
                    Infolist\TextEntry::make('shipping_zone')->label('Delivery zone')->placeholder('—'),
                    Infolist\TextEntry::make('shipping_fee')->label('Delivery fee')->formatStateUsing(fn ($state) => '৳'.number_format($state, 2)),
                    Infolist\TextEntry::make('total')->weight('bold')->formatStateUsing(fn ($state) => '৳'.number_format($state, 2)),
                ]),

            Infolist\Section::make('Activity')
                ->columns(4)
                ->schema([
                    Infolist\TextEntry::make('created_at')->label('Started')->dateTime(),
                    Infolist\TextEntry::make('last_activity_at')->label('Last seen')->since()->placeholder('—'),
                    Infolist\TextEntry::make('save_count')->label('Form saves'),
                    Infolist\TextEntry::make('recovered_at')->label('Converted')->dateTime()->placeholder('Not yet'),
                    Infolist\TextEntry::make('order.order_number')
                        ->label('Order')
                        ->formatStateUsing(fn ($state) => $state ? "#{$state}" : null)
                        ->placeholder('—'),
                    Infolist\TextEntry::make('notes')->placeholder('—')->columnSpan(3),
                ]),

            Infolist\Section::make('Ad attribution')
                ->columns(3)
                ->collapsed()
                ->schema([
                    Infolist\TextEntry::make('campaign.name')->label('Campaign')->placeholder('— organic / direct —'),
                    Infolist\TextEntry::make('utm_source')->placeholder('—'),
                    Infolist\TextEntry::make('utm_medium')->placeholder('—'),
                    Infolist\TextEntry::make('utm_campaign')->placeholder('—'),
                    Infolist\TextEntry::make('utm_content')->placeholder('—'),
                    Infolist\TextEntry::make('utm_term')->placeholder('—'),
                    Infolist\TextEntry::make('fbclid')->label('fbclid')->placeholder('—')->copyable(),
                    Infolist\TextEntry::make('ip_address')->placeholder('—'),
                    Infolist\TextEntry::make('user_agent')->placeholder('—')->columnSpanFull(),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('last_activity_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('customer_phone')
                    ->label('Phone')
                    ->searchable()
                    ->placeholder('— no number —')
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('customer_name')
                    ->label('Name')
                    ->searchable()
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('cart_summary')
                    ->label('Cart')
                    ->getStateUsing(fn (AbandonedCheckout $record) => collect([
                        $record->product_name,
                        $record->variant ? "Size {$record->variant}" : null,
                        $record->color,
                        $record->quantity > 1 ? "×{$record->quantity}" : null,
                    ])->filter()->implode(' · ') ?: '—')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('total')
                    ->formatStateUsing(fn ($state) => '৳'.number_format($state))
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (CheckoutStatus $state) => $state->color())
                    ->formatStateUsing(fn (CheckoutStatus $state) => $state->label()),
                Tables\Columns\TextColumn::make('campaign.name')
                    ->label('Campaign')
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('last_activity_at')
                    ->label('Last seen')
                    ->since()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Started')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(CheckoutStatus::options())
                    ->default(CheckoutStatus::Abandoned->value),
                Tables\Filters\SelectFilter::make('campaign_id')
                    ->label('Campaign')
                    ->relationship('campaign', 'name'),
                Tables\Filters\Filter::make('has_phone')
                    ->label('Has phone number')
                    ->query(fn (Builder $query) => $query->whereNotNull('customer_phone'))
                    ->toggle(),
                Tables\Filters\Filter::make('today')
                    ->query(fn (Builder $query) => $query->today())
                    ->toggle(),
                Tables\Filters\Filter::make('this_month')
                    ->query(fn (Builder $query) => $query->thisMonth())
                    ->toggle(),
            ])
            ->actions([
                Tables\Actions\Action::make('call')
                    ->icon('heroicon-o-phone')
                    ->color('gray')
                    ->url(fn (AbandonedCheckout $record) => 'tel:'.preg_replace('/\s+/', '', (string) $record->customer_phone))
                    ->visible(fn (AbandonedCheckout $record) => filled($record->customer_phone)),
                Tables\Actions\Action::make('whatsapp')
                    ->label('WhatsApp')
                    ->icon('heroicon-o-chat-bubble-left-right')
                    ->color('success')
                    ->url(fn (AbandonedCheckout $record) => static::whatsappUrl($record))
                    ->openUrlInNewTab()
                    ->visible(fn (AbandonedCheckout $record) => filled($record->customer_phone)),
                Tables\Actions\ActionGroup::make([
                    Tables\Actions\Action::make('convert')
                        ->label('Convert to order')
                        ->icon('heroicon-o-shopping-bag')
                        ->color('primary')
                        ->visible(fn (AbandonedCheckout $record) => ! $record->status->isConverted())
                        ->form([
                            Forms\Components\TextInput::make('customer_name')->required()
                                ->default(fn (AbandonedCheckout $record) => $record->customer_name),
                            Forms\Components\TextInput::make('customer_phone')->required()->tel()
                                ->default(fn (AbandonedCheckout $record) => $record->customer_phone),
                            Forms\Components\Textarea::make('customer_address')
                                ->default(fn (AbandonedCheckout $record) => $record->customer_address),
                            Forms\Components\TextInput::make('quantity')->numeric()->minValue(1)->required()
                                ->default(fn (AbandonedCheckout $record) => max(1, $record->quantity)),
                            Forms\Components\TextInput::make('unit_price')->label('Unit price (৳)')->numeric()->minValue(0)->required()
                                ->default(fn (AbandonedCheckout $record) => $record->unit_price),
                            Forms\Components\TextInput::make('shipping_fee')->label('Delivery fee (৳)')->numeric()->minValue(0)
                                ->default(fn (AbandonedCheckout $record) => $record->shipping_fee),
                        ])
                        ->action(function (AbandonedCheckout $record, array $data) {
                            $customer = Customer::firstOrCreate(
                                ['phone' => $data['customer_phone']],
                                ['name' => $data['customer_name'], 'address' => $data['customer_address'] ?? null],
                            );

                            $order = Order::create([
                                'customer_id' => $customer->id,
                                'product_name' => $record->product_name ?: 'Order',
                                'variant' => $record->variant,
                                'color' => $record->color,
                                'quantity' => $data['quantity'],
                                'unit_price' => $data['unit_price'],
                                'shipping_zone' => $record->shipping_zone,
                                'shipping_fee' => $data['shipping_fee'] ?? 0,
                                'status' => OrderStatus::New,
                                'campaign_id' => $record->campaign_id,
                                'ad_identifier' => $record->ad_identifier,
                                'utm_source' => $record->utm_source,
                                'utm_medium' => $record->utm_medium,
                                'utm_campaign' => $record->utm_campaign,
                                'utm_content' => $record->utm_content,
                                'utm_term' => $record->utm_term,
                                'fbclid' => $record->fbclid,
                                'fbp' => $record->fbp,
                                'fbc' => $record->fbc,
                            ]);

                            $record->markConverted($order);

                            Notification::make()
                                ->success()
                                ->title("Order #{$order->order_number} created")
                                ->send();
                        }),
                    Tables\Actions\Action::make('mark_recovered')
                        ->label('Mark recovered')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->visible(fn (AbandonedCheckout $record) => ! $record->status->isTerminal())
                        ->action(fn (AbandonedCheckout $record) => $record->forceFill([
                            'status' => CheckoutStatus::Recovered,
                            'recovered_at' => now(),
                        ])->save()),
                    Tables\Actions\Action::make('mark_lost')
                        ->label('Mark lost')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->visible(fn (AbandonedCheckout $record) => ! $record->status->isTerminal())
                        ->action(fn (AbandonedCheckout $record) => $record->update(['status' => CheckoutStatus::Lost])),
                ])
                    ->label('Actions')
                    ->button()
                    ->color('gray'),
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    /** International MSISDN with no `+` / leading zero, the way wa.me wants it. */
    protected static function whatsappNumber(?string $phone): string
    {
        $digits = preg_replace('/\D+/', '', (string) $phone);

        if (str_starts_with($digits, '0')) {
            return '88'.$digits;
        }

        if (str_starts_with($digits, '88')) {
            return $digits;
        }

        return $digits;
    }

    protected static function whatsappUrl(AbandonedCheckout $record): string
    {
        $name = $record->customer_name ?: 'ভাই/আপু';
        $product = $record->product_name ?: 'আপনার অর্ডারটি';

        $message = "আসসালামু আলাইকুম {$name}, আপনি {$product} অর্ডার করতে গিয়ে থেমে গিয়েছিলেন। "
            .'ডেলিভারি নিশ্চিত করতে কি সাহায্য লাগবে?';

        return 'https://wa.me/'.static::whatsappNumber($record->customer_phone)
            .'?text='.rawurlencode($message);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAbandonedCheckouts::route('/'),
            'view' => Pages\ViewAbandonedCheckout::route('/{record}'),
            'edit' => Pages\EditAbandonedCheckout::route('/{record}/edit'),
        ];
    }
}
