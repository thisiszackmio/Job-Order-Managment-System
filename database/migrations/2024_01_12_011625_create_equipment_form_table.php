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
        Schema::create('equipment_form', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('p_p_a_users');
            $table->string('type_of_equipment');
            $table->date('date_request');
            $table->string('title_of_activity');
            $table->date('date_of_activity');
            $table->time('time_start');
            $table->time('time_end');
            $table->string('instructions', 1000)->nullable();
            $table->string('driver')->nullable();
            $table->string('operator')->nullable();
            $table->string('rescue_members', 1000)->nullable();
            $table->string('opr', 1000)->nullable();
            $table->smallInteger('division_manager_id');
            $table->boolean('division_manager_approval')->default(false);
            $table->boolean('admin_manager_approval')->default(false);
            $table->boolean('harbor_master_approval')->default(false);
            $table->boolean('port_manager_approval')->default(false);
            $table->boolean('status')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_form');
    }
};
