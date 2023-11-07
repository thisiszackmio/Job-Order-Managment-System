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
        Schema::create('request_facility', function (Blueprint $table) {
            $table->id();
            $table->date('date_requested');
            $table->string('request_office');
            $table->string('title_of_activity');
            $table->timestamp('datetime_start')->default(now());
            $table->timestamp('datetime_end')->default(now());
            $table->char('mph', 10);
            $table->char('conference', 10);
            $table->char('dorm', 10);
            $table->char('other', 10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_facility');
    }
};
