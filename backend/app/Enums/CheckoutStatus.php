<?php

namespace App\Enums;

enum CheckoutStatus: string
{
    /** Visitor is still on the form (or just left — not swept yet). */
    case Active = 'active';

    /** Went quiet with no order — the sweep command moved it here. */
    case Abandoned = 'abandoned';

    /** Placed an order after being abandoned (follow-up worked). */
    case Recovered = 'recovered';

    /** Completed the order in the same visit — never really abandoned. */
    case Ordered = 'ordered';

    /** Followed up, no sale — closed by hand. */
    case Lost = 'lost';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Active',
            self::Abandoned => 'Abandoned',
            self::Recovered => 'Recovered',
            self::Ordered => 'Ordered',
            self::Lost => 'Lost',
        };
    }

    /**
     * Color token consumed by the Filament UI (badges, etc).
     */
    public function color(): string
    {
        return match ($this) {
            self::Active => 'info',
            self::Abandoned => 'warning',
            self::Recovered => 'success',
            self::Ordered => 'primary',
            self::Lost => 'danger',
        };
    }

    /** A checkout in one of these states will never be worked again. */
    public function isTerminal(): bool
    {
        return in_array($this, [self::Recovered, self::Ordered, self::Lost], true);
    }

    /** True once the checkout turned into a real order. */
    public function isConverted(): bool
    {
        return in_array($this, [self::Recovered, self::Ordered], true);
    }

    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn (self $status) => [$status->value => $status->label()])
            ->all();
    }
}
