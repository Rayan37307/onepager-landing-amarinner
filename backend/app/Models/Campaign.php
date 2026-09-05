<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'platform',
        'external_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Find (or create) the campaign an order / checkout should be attributed
     * to, from the attribution fields the landing page sends. A manual
     * `campaign` override wins over the UTM params.
     */
    public static function resolveFromAttribution(array $data): ?self
    {
        if (filled($data['campaign'] ?? null)) {
            return static::firstOrCreate(['name' => $data['campaign']]);
        }

        if (filled($data['utm_campaign'] ?? null)) {
            return static::firstOrCreate(
                ['name' => $data['utm_campaign']],
                ['platform' => $data['utm_source'] ?? 'other']
            );
        }

        return null;
    }

    public function adSpends(): HasMany
    {
        return $this->hasMany(AdSpend::class);
    }
}
