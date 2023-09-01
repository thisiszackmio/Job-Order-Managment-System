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
        Schema::create('deployment_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('p_p_a_users'); // Assuming the user's table is named 'users'
            $table->string('type_of_service');
            $table->string('type_of_repair')->nullable();
            $table->string('detail_repair')->nullable();
            $table->string('location_repair')->nullable();
            $table->string('type_of_personel')->nullable();
            $table->string('detail_personnel')->nullable();
            $table->string('purpose_personnel')->nullable();
            $table->string('location_personnel')->nullable();
            $table->string('detail_supply')->nullable();
            $table->integer('supply_no')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deployment_data');
    }
};
