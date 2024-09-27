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
        Schema::create('joms_vehicle_slip_form', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('user_name');
            $table->string('purpose', 500);
            $table->string('passengers', 1000);
            $table->string('place_visited');
            $table->date('date_arrival');
            $table->time('time_arrival');
            $table->string('vehicle_type')->nullable();
            $table->string('driver')->nullable();
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
        Schema::dropIfExists('vehicle_slip_form');
    }
};
