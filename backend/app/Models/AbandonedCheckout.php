<?php

namespace App\Models;

use App\Enums\CheckoutStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class AbandonedCheckout extends Model
{
    use HasFactory;

    protected $fillable = [
        'token',
        'customer_id',
        'order_id',
        'customer_name',
        'customer_phone',
        'customer_address',
        'product_name',
        'variant',
        'color',
        'quantity',
        'unit_price',
        'shipping_zone',
        'shipping_fee',
        'total',
        'status',
        'campaign_id',
        'ad_identifier',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'fbclid',
        'fbp',
        'fbc',
        'ip_address',
        'user_agent',
        'save_count',
        'last_activity_at',
        'recovered_at',
        'notes',
    ];

    protected $casts = [
        'status' => CheckoutStatus::class,
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'total' => 'decimal:2',
        'save_count' => 'integer',
        'last_activity_at' => 'datetime',
        'recovered_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saving(function (AbandonedCheckout $checkout) {
            $checkout->status ??= CheckoutStatus::Active;
            $checkout->last_activity_at ??= now();
            $checkout->total = self::computeTotal($checkout);
        });
    }

    private static function computeTotal(AbandonedCheckout $checkout): float
    {
        return round($checkout->quantity * (float) $checkout->unit_price + (float) $checkout->shipping_fee, 2);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    /**
     * Link this checkout to the order it turned into and close it out.
     * "Recovered" when we'd already given up on it, "Ordered" otherwise.
     */
    public function markConverted(Order $order): void
    {
        if ($this->status->isConverted()) {
            return;
        }

        $this->forceFill([
            'order_id' => $order->id,
            'customer_id' => $order->customer_id,
            'status' => $this->status === CheckoutStatus::Abandoned
                ? CheckoutStatus::Recovered
                : CheckoutStatus::Ordered,
            'recovered_at' => now(),
        ])->save();
    }

    /** Active checkouts we haven't heard from in `$minutes` and that never ordered. */
    public function scopeStale(Builder $query, int $minutes): Builder
    {
        return $query
            ->where('status', CheckoutStatus::Active)
            ->whereNull('order_id')
            ->where('last_activity_at', '<=', now()->subMinutes($minutes));
    }

    /** Abandoned checkouts we can actually chase (we have a phone number). */
    public function scopeRecoverable(Builder $query): Builder
    {
        return $query
            ->where('status', CheckoutStatus::Abandoned)
            ->whereNotNull('customer_phone');
    }

    public function scopeStatus(Builder $query, CheckoutStatus $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('created_at', Carbon::today());
    }

    public function scopeThisMonth(Builder $query): Builder
    {
        return $query->whereBetween('created_at', [
            Carbon::now()->startOfMonth(),
            Carbon::now()->endOfMonth(),
        ]);
    }
}
