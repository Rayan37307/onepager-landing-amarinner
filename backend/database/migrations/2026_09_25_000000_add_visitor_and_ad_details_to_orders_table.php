<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // District picked on the order form, kept on its own so it doesn't
            // have to be parsed back out of `shipping_zone`.
            $table->string('district')->nullable()->after('shipping_fee');

            // Meta ad hierarchy, from the ad's URL parameters
            // (campaign_id={{campaign.id}}, adset_name={{adset.name}}, …).
            // Prefixed `fb_` so they don't clash with the local `campaign_id` FK.
            $table->string('fb_campaign_id')->nullable()->after('ad_identifier');
            $table->string('fb_adset_id')->nullable()->after('fb_campaign_id');
            $table->string('fb_ad_id')->nullable()->after('fb_adset_id');
            $table->string('adset_name')->nullable()->after('fb_ad_id');
            $table->string('ad_name')->nullable()->after('adset_name');
            $table->string('placement')->nullable()->after('ad_name');

            // Visit details captured by the landing page.
            $table->text('landing_page')->nullable()->after('placement');
            $table->text('referrer')->nullable()->after('landing_page');
            $table->string('session_id', 64)->nullable()->index()->after('referrer');
            $table->unsignedInteger('time_to_order_seconds')->nullable()->after('session_id');

            // "Same IP orders" is counted on every order view.
            $table->index('ip_address');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['ip_address']);
            $table->dropIndex(['session_id']);
            $table->dropColumn([
                'district', 'fb_campaign_id', 'fb_adset_id', 'fb_ad_id', 'adset_name', 'ad_name',
                'placement', 'landing_page', 'referrer', 'session_id', 'time_to_order_seconds',
            ]);
        });
    }
};
