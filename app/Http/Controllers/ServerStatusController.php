<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class ServerStatusController extends Controller
{
    public function diskUsage(): JsonResponse
    {
        $freeSpace = disk_free_space('/');
        $totalSpace = disk_total_space('/');

        $freeInMB = round($freeSpace / 1024 / 1024, 2);
        $totalInMB = round($totalSpace / 1024 / 1024, 2);
        $usedInMB = round($totalInMB - $freeInMB, 2);

        return response()->json([
            'total_mb' => $totalInMB,
            'used_mb'  => $usedInMB,
            'free_mb'  => $freeInMB,
        ]);
    }
}
