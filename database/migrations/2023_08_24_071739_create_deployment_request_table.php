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
        Schema::create('deployment_request', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\Deployment::class, 'dp_id');
            $table->foreignIdFor(\App\Models\PPAUser::class, 'user_id');
            $table->integer('recommend_approval');
            $table->integer('manager_approval');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deployment_request');
    }
};
