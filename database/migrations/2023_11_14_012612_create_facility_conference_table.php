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
        Schema::create('facility_conference', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facility__form_id')->constrained('request__facility');
            $table->boolean('table')->default(false);
            $table->integer('no_table')->nullable();
            $table->boolean('chair')->default(false);
            $table->integer('no_chair')->nullable();
            $table->boolean('microphone')->default(false);
            $table->integer('no_microphone')->nullable();
            $table->boolean('others')->default(false);
            $table->string('specify')->nullable();
            $table->boolean('projector')->default(false);
            $table->boolean('projector_screen')->default(false);
            $table->boolean('document_camera')->default(false);
            $table->boolean('laptop')->default(false);
            $table->boolean('television')->default(false);
            $table->boolean('sound_system')->default(false);
            $table->boolean('videoke')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facility_conference');
    }
};
