<?php

namespace App\Http\Controllers;

use App\Models\Announce;
use App\Models\LogsModel;
use App\Models\PPAEmployee;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\URL;

class AnnounceController extends Controller
{
    /**
     * Show all Announcement Data
     */
    public function showAnnouncements(){

        $data = Announce::all();

        return response()->json($data);
    }

    /**
     * Create A Announcement
     */
    public function storeAnnouncements(Request $request){
        $data = $request->validate([
            'date_of_request' => 'required|string',
            'details' => 'required|string|max:1000',
        ]);

        //Create the announcement data
        try {
            $announcement = Announce::create($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Data Error', 'message'], 500);
        }

        return response()->json(['message' => 'Announcement created successfully', 'data' => $announcement], 200);
    }

    /**
     * Edit A Announcement
     */
    public function editAnnouncements(Request $request, $id){
        $data = $request->validate([
            'details' => 'required|string|max:1000',
        ]);

        $checkAnn = Announce::where('id', $id)->first();

        if(!$checkAnn){
            return response()->json(['error' => 'Facility not found'], 404);
        }

        $checkAnn->update([
            'details' => $data['details'],
        ]);

        return response()->json(['message' => 'Announcement update successfully'], 200);
    }

    /**
     * Delete A Announcement
     */
    public function deleteAnnouncements($id){

        $announcement = Announce::find($id);

        // Check if the announcement exists
        if(!$announcement){
            return response()->json(['error' => 'Announcement not found'], 404);
        }

        // Delete the announcement
        $announcement->delete();

        // Return a success response
        return response()->json(['message' => 'Announcement deleted successfully'], 200);
    }

    // -------- For TEAM ------- // // -------- For TEAM ------- // // -------- For TEAM ------- // // -------- For TEAM ------- //

    public function teamList(){

        // Root URL
        $rootUrl = URL::to('/');

        $data = PPAEmployee::whereIn('status', [1, 2])->orderBy('lastname')->get();

        $userData = [];

        foreach ($data as $user){
            $userData[] = [
                'id' => $user->id,
                'name' => $user->firstname. " ".$user->middlename. ". ". $user->lastname,
                'division' => $user->division,
                'position' => $user->position,
                'avatar' =>  $rootUrl . '/storage/displaypicture/' . $user->avatar,
            ];
        }

        return response()->json($userData);

    }

    
}
