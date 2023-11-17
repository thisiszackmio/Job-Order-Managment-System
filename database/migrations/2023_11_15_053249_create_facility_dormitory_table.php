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
        Schema::create('facility_dormitory', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facility__form_id')->constrained('request__facility');
            $table->string('name_male', 1000);
            $table->string('name_female', 1000);
            $table->string('other_details');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('facility_dormitory');
    }
};
