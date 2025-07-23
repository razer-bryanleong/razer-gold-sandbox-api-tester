<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class RazerPaymentController extends Controller
{
    public function returnUrl(Request $request)
    {
        $data = $request->all();
        Log::info('Razer Return URL Callback Received', $data);
        return view('razer_return', ['data' => $data]);
    }

    public function sendPaymentProxy(Request $request)
    {
        $apiUrl = 'https://globalapi.gold-sandbox.razer.com/payout/payments';
        $payload = $request->all();

        try {
            $response = Http::withoutVerifying()->asForm()->post($apiUrl, $payload);

            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            Log::error('Razer Gold API Proxy Error:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An error occurred while contacting the Razer Gold API.'], 500);
        }
    }
}
