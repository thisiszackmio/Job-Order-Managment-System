<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('inspector__forms', function (Blueprint $table) {
            $table->id();
            $table->integer('inspection__form_id');
            $table->date('before_repair_date');
            $table->string('findings');
            $table->string('recommendations');
            $table->date('after_reapir_date')->nullable();
            $table->string('remarks')->nullable();
            $table->integer('close')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspector_form');
    }
};
