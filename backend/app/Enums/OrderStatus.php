<?php

namespace App\Enums;

enum OrderStatus: string
{
    case New = 'new';
    case Called = 'called';
    case Confirmed = 'confirmed';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::New => 'New',
            self::Called => 'Called',
            self::Confirmed => 'Confirmed',
            self::Shipped => 'Dispatched',
            self::Delivered => 'Delivered',
            self::Cancelled => 'Cancelled',
        };
    }

    /**
     * Color token consumed by the Filament UI (badges, etc).
     */
    public function color(): string
    {
        return match ($this) {
            self::New => 'gray',
            self::Called => 'info',
            self::Confirmed => 'primary',
            self::Shipped => 'warning',
            self::Delivered => 'success',
            self::Cancelled => 'danger',
        };
    }

    /**
     * The main happy-path pipeline, in order. Cancelled is a separate
     * terminal state reachable from any non-terminal status.
     */
    public static function pipeline(): array
    {
        return [self::New, self::Called, self::Confirmed, self::Shipped, self::Delivered];
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::Delivered, self::Cancelled], true);
    }

    /**
     * Statuses this order can move to next, from its current status.
     */
    public function nextStatuses(): array
    {
        if ($this->isTerminal()) {
            return [];
        }

        $pipeline = self::pipeline();
        $index = array_search($this, $pipeline, true);
        $next = $pipeline[$index + 1] ?? null;

        return array_filter([$next, self::Cancelled]);
    }

    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn (self $status) => [$status->value => $status->label()])
            ->all();
    }
}
