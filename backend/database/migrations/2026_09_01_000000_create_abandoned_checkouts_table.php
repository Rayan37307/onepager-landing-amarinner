<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('abandoned_checkouts', function (Blueprint $table) {
            $table->id();

            // Client-generated token that ties every partial save from one
            // browser visit to the same row (see frontend lib/checkout.js).
            $table->uuid('token')->unique();

            // Filled in once we can match the checkout to a person / a real
            // order — both stay null while the visitor is still deciding.
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();

            // Partial contact details — whatever the visitor had typed so far.
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable()->index();
            $table->text('customer_address')->nullable();

            // Cart snapshot (single line item, mirrors orders).
            $table->string('product_name')->nullable();
            $table->string('variant')->nullable();
            $table->string('color')->nullable();
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('unit_price', 12, 2)->default(0);
            $table->string('shipping_zone')->nullable();
            $table->decimal('shipping_fee', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);

            // active -> abandoned (swept) -> recovered / ordered / lost
            $table->string('status')->default('active')->index();

            // Ad attribution — same shape as orders so recovered carts keep
            // their source.
            $table->foreignId('campaign_id')->nullable()->constrained()->nullOnDelete();
            $table->string('ad_identifier')->nullable();
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('utm_content')->nullable();
            $table->string('utm_term')->nullable();
            $table->string('fbclid')->nullable();
            $table->string('fbp')->nullable();
            $table->string('fbc')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();

            // How far along the visitor got, and when we last heard from them.
            $table->unsignedInteger('save_count')->default(0);
            $table->timestamp('last_activity_at')->nullable()->index();
            $table->timestamp('recovered_at')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('abandoned_checkouts');
    }
};
