<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Behind cPanel/AutoSSL the app often sees plain HTTP from the proxy, so
        // generated URLs (Filament assets, redirects) would come out as http://
        // and break under HTTPS. Force the scheme in production.
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
