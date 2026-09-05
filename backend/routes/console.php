<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Promote checkouts that have gone quiet to "abandoned" so the dashboard can
// surface them for a recovery call. Needs `php artisan schedule:run` on cron.
Schedule::command('checkouts:sweep')->everyFifteenMinutes();
