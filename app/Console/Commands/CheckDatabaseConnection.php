<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckDatabaseConnection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:check-connection';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check database connection';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        try {
            DB::connection()->getPdo();
            $this->info('Connected successfully to the database.');
        } catch (\Exception $e) {
            $this->error('Could not connect to the database. Error: ' . $e->getMessage());
        }

        return 0;
    }
}
