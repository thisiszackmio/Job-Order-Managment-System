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
        Schema::create('joms_facility_venue', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('user_name');
            $table->string('request_office');
            $table->string('title_of_activity');
            $table->date('date_start');
            $table->time('time_start');
            $table->date('date_end');
            $table->time('time_end');
            $table->boolean('mph')->default(false);
            $table->boolean('conference')->default(false);
            $table->boolean('dorm')->default(false);
            $table->boolean('other')->default(false);
            $table->boolean('table')->default(false);
            $table->integer('no_table')->nullable();
            $table->boolean('chair')->default(false);
            $table->integer('no_chair')->nullable();
            $table->boolean('microphone')->default(false);
            $table->integer('no_microphone')->nullable();
            $table->boolean('others')->default(false);
            $table->string('specify', 500)->nullable();
            $table->boolean('projector')->default(false);
            $table->boolean('projector_screen')->default(false);
            $table->boolean('document_camera')->default(false);
            $table->boolean('laptop')->default(false);
            $table->boolean('television')->default(false);
            $table->boolean('sound_system')->default(false);
            $table->boolean('videoke')->default(false);
            $table->string('name_male', 1000)->nullable();
            $table->string('name_female', 1000)->nullable();
            $table->string('other_details')->nullable();
            $table->boolean('admin_approval')->default(false);
            $table->date('date_approve')->nullable();
            $table->string('obr_instruct')->nullable();
            $table->string('obr_comment')->nullable();
            $table->string('remarks')->nullable();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('joms_facility_venue');
    }
};
