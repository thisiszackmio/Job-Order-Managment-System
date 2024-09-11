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
        Schema::create('notification', function (Blueprint $table) {
            $table->id();
            $table->string('type_of_jlms');
            $table->string('sender_avatar');
            $table->smallInteger('sender_id');
            $table->string('sender_name');
            $table->string('message', 500);
            $table->smallInteger('receiver_id');
            $table->string('receiver_name');
            $table->string('joms_type')->nullable();
            $table->smallInteger('joms_id')->nullable();
            $table->smallInteger('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification');
    }
};
