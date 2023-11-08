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
        Schema::create('inspection_form_admin', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inspection__form_id')->constrained('inspection__forms');
            $table->date('date_of_filling');
            $table->date('date_of_last_repair')->nullable();
            $table->string('nature_of_last_repair')->nullable();
            $table->integer('assign_personnel');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_form_admin');
    }
};
