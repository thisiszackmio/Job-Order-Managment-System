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
        Schema::create('deployments', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\PPAUser::class, 'user_id');
            $table->date('request_created')->nullable();
            $table->string('type_of_service')->nullable();
            $table->string('type_of_repair')->nullable();
            $table->string('details_repair')->nullable();
            $table->string('type_of_personel')->nullable();
            $table->string('details_personel')->nullable();
            $table->string('details_supply')->nullable();
            $table->string('location_repair')->nullable();
            $table->string('location_personel')->nullable();
            $table->string('personel_purpose')->nullable();
            $table->integer('no_of_supplies')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deployments');
    }
};
