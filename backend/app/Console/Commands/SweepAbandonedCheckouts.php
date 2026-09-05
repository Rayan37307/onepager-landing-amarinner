<?php

namespace App\Console\Commands;

use App\Enums\CheckoutStatus;
use App\Models\AbandonedCheckout;
use Illuminate\Console\Command;

class SweepAbandonedCheckouts extends Command
{
    protected $signature = 'checkouts:sweep {--minutes=30 : Minutes of inactivity before a checkout counts as abandoned}';

    protected $description = 'Move stale active checkouts to the "abandoned" state so they show up for follow-up.';

    public function handle(): int
    {
        $minutes = max(1, (int) $this->option('minutes'));

        $swept = AbandonedCheckout::query()
            ->stale($minutes)
            ->update([
                'status' => CheckoutStatus::Abandoned,
                'updated_at' => now(),
            ]);

        $this->info("Marked {$swept} checkout(s) as abandoned (idle > {$minutes} min).");

        return self::SUCCESS;
    }
}
