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
        $apiUrl = $request->header('X-API-URL', 'https://globalapi.gold-sandbox.razer.com/payout/payments');
        $payload = $request->all();

        try {
            $response = Http::withoutVerifying()->asForm()->post($apiUrl, $payload);

            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            Log::error('Razer Gold API Proxy Error:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An error occurred while contacting the Razer Gold API.'], 500);
        }
    }

    public function sendPinQueryProxy(Request $request)
    {
        $apiUrl = 'https://globalapi.gold-sandbox.razer.com/payout/molpoints/pin';
        $queryParams = $request->query();

        try {
            $response = Http::withoutVerifying()->get($apiUrl, $queryParams);

            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            Log::error('Razer Gold PIN Query API Proxy Error:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An error occurred while contacting the Razer Gold PIN Query API.'], 500);
        }
    }
    public function generateSignature(Request $request)
    {
        $secretKey = $request->input('secretKey');
        $data = $request->input('data');

        if (empty($secretKey) || empty($data)) {
            return response()->json(['error' => 'Secret Key and data are required.'], 400);
        }

        $signature = hash_hmac('sha256', $data, $secretKey);

        return response()->json(['signature' => $signature]);
    }

    public function sendPaymentQueryProxy(Request $request)
    {
        $apiUrl = $request->header('X-API-URL', 'https://globalapi.gold-sandbox.razer.com/payout/payments');
        $queryParams = $request->query();
        Log::info('Payment Query Proxy Request Params', $queryParams);

        try {
            $response = Http::withoutVerifying()->get($apiUrl, $queryParams);
            Log::info('Payment Query Proxy Raw Response', ['body' => $response->body(), 'status' => $response->status()]);

            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            Log::error('Razer Gold Payment Query API Proxy Error:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An error occurred while contacting the Razer Gold Payment Query API.'], 500);
        }
    }
    public function generatePinQuerySignature(Request $request)
    {
        $secretKey = $request->input('secretKey');
        $data = $request->input('data');

        if (empty($secretKey) || empty($data)) {
            return response()->json(['error' => 'Secret Key and data are required.'], 400);
        }

        $signature = md5($data . $secretKey);

        return response()->json(['signature' => $signature]);
    }
}
