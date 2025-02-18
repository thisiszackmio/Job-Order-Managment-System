<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Sanctum\PersonalAccessToken;
use Carbon\Carbon;

class ExpireTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:expire-tokens';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete expired tokens at midnight';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get all tokens that were created before today (midnight)
        $expiredTokens = PersonalAccessToken::where('created_at', '<', Carbon::now()->startOfDay())->delete();

        $this->info("Expired tokens deleted: $expiredTokens");
    }
}
