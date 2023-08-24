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
        Schema::create('deployment_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\Deployment::class, 'dp_id');
            $table->string('assign_division');
            $table->date('date_assign_division');
            $table->string('assign_opr');
            $table->date('date_assign_opr');
            $table->integer('comment_status');
            $table->string('comment_description');
            $table->integer('closing_out');
            $table->date('date_closing_out');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deployment_verifications');
    }
};
