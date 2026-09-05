<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Selected size / variant label from the landing page (e.g. "34").
            $table->string('variant')->nullable()->after('product_name');
            // Selected colour, when the product has colour options.
            $table->string('color')->nullable()->after('variant');

            // Delivery zone chosen on the order form (e.g. "inside_dhaka") and
            // its fee, which is added on top of quantity * unit_price.
            $table->string('shipping_zone')->nullable()->after('total');
            $table->decimal('shipping_fee', 12, 2)->default(0)->after('shipping_zone');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['variant', 'color', 'shipping_zone', 'shipping_fee']);
        });
    }
};
