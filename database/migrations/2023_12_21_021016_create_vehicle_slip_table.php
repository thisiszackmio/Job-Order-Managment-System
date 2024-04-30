<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicle_slip', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('p_p_a_users');
            $table->date('date_of_request');
            $table->string('purpose', 500);
            $table->string('passengers', 1000);
            $table->string('place_visited');
            $table->date('date_arrival');
            $table->time('time_arrival');
            $table->string('vehicle_type');
            $table->string('driver');
            $table->boolean('admin_approval')->default(false);
            $table->string('remarks', 500);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_slip');
    }
};
