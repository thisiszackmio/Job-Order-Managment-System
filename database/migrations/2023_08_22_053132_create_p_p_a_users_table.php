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
        Schema::create('p_p_a_users', function (Blueprint $table) {
            $table->id();
            $table->string('fname');
            $table->string('mname');
            $table->string('lname');
            $table->string('gender');
            $table->string('username');
            $table->string('division');
            $table->string('position');
            $table->integer('code_clearance');
            $table->string('password');
            $table->string('image');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('p_p_a_users');
    }
};
