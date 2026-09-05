<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Meta Pixel `_fbc` click-id cookie captured by the landing page.
            // More reliable than reconstructing it from the raw fbclid; the
            // Conversions API sends it in user_data to improve attribution.
            $table->string('fbc')->nullable()->after('fbp');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('fbc');
        });
    }
};
