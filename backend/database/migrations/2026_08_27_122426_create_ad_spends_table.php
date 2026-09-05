<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_spends', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->decimal('amount', 12, 2);
            $table->timestamps();

            $table->unique(['campaign_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_spends');
    }
};
