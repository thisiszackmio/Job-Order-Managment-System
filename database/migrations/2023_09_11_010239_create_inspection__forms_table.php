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
        Schema::create('inspection__forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('p_p_a_users');
            $table->date('date_of_request');
            $table->string('property_number');
            $table->date('acq_date');
            $table->string('acq_cost');
            $table->string('brand_model');
            $table->string('serial_engine_no');
            $table->string('type_of_property');
            $table->string('property_other_specific')->nullable();
            $table->string('property_description');
            $table->string('location');
            $table->string('complain');
            $table->smallInteger('supervisor_name');
            $table->boolean('supervisor_approval')->default(false);
            $table->boolean('admin_approval')->default(false);
            $table->boolean('inspector_status')->default(false);
            $table->string('remarks', 500)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection__forms');
    }
};
