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
        Schema::create('joms_inspection_form', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('user_name');
            $table->string('property_number')->nullable();
            $table->date('acquisition_date')->nullable();
            $table->string('acquisition_cost')->nullable();
            $table->string('brand_model')->nullable();
            $table->string('serial_engine_no')->nullable();
            $table->string('type_of_property');
            $table->string('property_description');
            $table->string('location');
            $table->string('complain', 500);
            $table->date('date_of_filling')->nullable();
            $table->date('date_of_last_repair')->nullable();
            $table->string('nature_of_last_repair')->nullable();
            $table->date('before_repair_date')->nullable();
            $table->date('after_reapir_date')->nullable();
            $table->string('findings', 500)->nullable();
            $table->string('recommendations', 500)->nullable();
            $table->string('remarks', 500);
            $table->smallInteger('supervisor_id');
            $table->string('supervisor_name');
            $table->smallInteger('personnel_id')->nullable();
            $table->string('personnel_name')->nullable();
            $table->boolean('form_status')->default(false);
            $table->string('form_remarks', 500);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('joms_inspection_form');
    }
};
