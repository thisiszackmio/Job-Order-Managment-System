<?php

namespace App\Http\Controllers;
use App\Models\LogsModel;
use Carbon\Carbon;
use Illuminate\Http\Request;

class LogsController extends Controller
{
    public function dashboardLogs(){
        $startDate = Carbon::today()->startOfDay();
        $endDate = Carbon::today()->endOfDay();

        // Retrieve logs within the current month
        $logs = LogsModel::whereBetween('created_at', [$startDate, $endDate])->orderBy('created_at', 'desc')->get();

        return response()->json($logs);
    }

    public function showLogs(Request $request){

        // Get Date
        $getStartDate = $request->input('startDate');
        $getEndDate = $request->input('endDate');

        // Date
        $startDate = Carbon::createFromFormat('Y-m-d', $getStartDate);
        $endDate = Carbon::createFromFormat('Y-m-d', $getEndDate);

        // Retrieve logs within the selected date range
        $logs = LogsModel::whereBetween('created_at', [$startDate, $endDate])->orderBy('created_at', 'desc')->get();

        return response()->json($logs);
    }
}
