<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'customer_id',
        'product_name',
        'variant',
        'color',
        'quantity',
        'unit_price',
        'total',
        'shipping_zone',
        'shipping_fee',
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
        'capi_sent_at',
        'capi_response',
        'notes',
    ];

    protected $casts = [
        'status' => OrderStatus::class,
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'capi_sent_at' => 'datetime',
        'capi_response' => 'array',
    ];

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            $order->status ??= OrderStatus::New;
            $order->total = self::computeTotal($order);
        });

        static::updating(function (Order $order) {
            if ($order->isDirty(['quantity', 'unit_price', 'shipping_fee'])) {
                $order->total = self::computeTotal($order);
            }
        });

        static::created(function (Order $order) {
            if (blank($order->order_number)) {
                $order->forceFill(['order_number' => (string) (1000 + $order->id)])->saveQuietly();
            }

            $order->statusHistories()->create([
                'status' => $order->status,
                'changed_at' => $order->created_at ?? now(),
            ]);
        });
    }

    private static function computeTotal(Order $order): float
    {
        return round($order->quantity * $order->unit_price + (float) $order->shipping_fee, 2);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->orderBy('changed_at');
    }

    /**
     * Move the order to a new status and record it in the history trail.
     */
    public function transitionTo(OrderStatus $status, ?string $note = null, ?int $userId = null): void
    {
        $this->update(['status' => $status]);

        $this->statusHistories()->create([
            'status' => $status,
            'note' => $note,
            'user_id' => $userId,
            'changed_at' => now(),
        ]);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', Carbon::today());
    }

    public function scopeThisMonth($query)
    {
        return $query->whereBetween('created_at', [
            Carbon::now()->startOfMonth(),
            Carbon::now()->endOfMonth(),
        ]);
    }

    public function scopeStatus($query, OrderStatus $status)
    {
        return $query->where('status', $status);
    }
}
