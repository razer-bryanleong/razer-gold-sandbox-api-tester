<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Razer Gold Payment Query Tester</title>
    <link rel="stylesheet" href="{{ asset('css/signature-generator.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
</head>
<body>
    <div id="loader" class="loader-overlay">
        <div class="loader"></div>
    </div>
    <div class="main-content-wrapper">
        <div class="container signature-generator-section">
            <h1>HMAC-SHA256 Signature Generator for Payment Query</h1>

            <div class="input-group">
                <label for="secretKey">Secret Key:</label>
                <div class="password-input-container">
                    <input type="password" id="secretKey" value="Ziu61T9xY227aazS530Pk8C5424y663r">
                    <span class="toggle-password" id="toggleSecretKey">
                        <i class="fas fa-eye"></i>
                    </span>
                </div>
            </div>

            <h2>Parameters</h2>
            <div class="input-group">
                <label for="applicationCode">applicationCode:</label>
                <input type="text" id="applicationCode" value="3f2504e04f8911d39a0c0305e82c3301">
                <p class="description">Unique code for the application.</p>
            </div>
            <div class="input-group">
                <label for="referenceId">referenceId:</label>
                <input type="text" id="referenceId" value="TRX1708901">
                <p class="description">Unique transaction reference ID (conditional).</p>
            </div>
            <div class="input-group">
                <label for="paymentId">paymentId:</label>
                <input type="text" id="paymentId" value="">
                <p class="description">Unique payment ID (conditional).</p>
            </div>
            <div class="input-group">
                <label for="version">version:</label>
                <input type="text" id="version" value="v1" readonly>
                <p class="description">API version being used.</p>
            </div>
            <div class="input-group">
                <label for="hashType">hashType:</label>
                <input type="text" id="hashType" value="hmac-sha256" readonly>
                <p class="description">Hashing algorithm used for signature.</p>
            </div>

            <div class="output-group">
                <label for="concatenatedString">Concatenated String (before hashing):</label>
                <textarea id="concatenatedString" rows="5" readonly></textarea>
            </div>

            <div class="output-group">
                <label for="generatedSignature">Generated Signature:</label>
                <div class="signature-output-container">
                    <textarea id="generatedSignature" rows="3" readonly></textarea>
                    <button class="copy-button" id="copySignature">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
            <button id="generateButton">Generate Signature</button>
            <button id="saveButton">Save Inputs</button>
        </div>

        <div class="container payment-tester-section">
            <h1>Razer Gold Payment Query Tester</h1>
            <div class="input-group">
                <label for="paymentQueryApiUrl">Razer Gold Payment Query API URL:</label>
                <input type="text" id="paymentQueryApiUrl" value="https://globalapi.gold-sandbox.razer.com/payout/payments" readonly>
                <p class="description">The endpoint for Razer Gold Payment Query API.</p>
            </div>
            <button id="sendPaymentQueryRequest">Send Payment Query Request</button>

            <div class="output-group">
                <label for="requestPayload">Request Payload (Query String):</label>
                <textarea id="requestPayload" rows="10" readonly></textarea>
            </div>

            <div class="output-group">
                <label for="responsePayload">Response Payload (JSON):</label>
                <textarea id="responsePayload" rows="10" readonly></textarea>
            </div>

            <div class="output-group">
                <label>Extracted Payment Details:</label>
                <div id="paymentDetailsOutput" class="payment-details-output"></div>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script src="{{ asset('js/payment-query-generator.js') }}"></script>
</body>
</html>