<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // Nullable at the DB level — the Order model fills this in right
            // after insert (it's derived from the auto-increment id), so it's
            // briefly absent during the INSERT itself.
            $table->string('order_number')->nullable()->unique();

            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();

            // Line item — kept simple (single product per order) on purpose.
            $table->string('product_name');
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('unit_price', 12, 2);
            $table->decimal('total', 12, 2);

            $table->string('status')->default('new')->index();

            // Ad attribution
            $table->foreignId('campaign_id')->nullable()->constrained()->nullOnDelete();
            $table->string('ad_identifier')->nullable(); // ad/creative/content id
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('utm_content')->nullable();
            $table->string('utm_term')->nullable();
            $table->string('fbclid')->nullable();
            $table->string('fbp')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();

            // Meta Conversions API delivery tracking
            $table->timestamp('capi_sent_at')->nullable();
            $table->json('capi_response')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
