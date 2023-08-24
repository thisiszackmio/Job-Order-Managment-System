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
            $table->string('type_of_service');
            $table->string('details_repair');
            $table->string('details_personel');
            $table->string('details_supply');
            $table->string('location_repair');
            $table->string('location_personel');
            $table->string('personel_purpose');
            $table->integer('no_of_supplies');
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
