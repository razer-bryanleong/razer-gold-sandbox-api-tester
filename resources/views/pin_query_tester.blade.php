<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Razer Gold PIN Query Tester</title>
    <link rel="stylesheet" href="{{ asset('css/payment-tester.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
</head>
<body>
    @include('components.navbar')
    <div id="loader" class="loader-overlay">
        <div class="loader"></div>
    </div>
    <div class="main-content-wrapper">
        <div class="container payment-tester-section">
            <h1>HMAC-SHA256 Signature Generator (PIN Query)</h1>

            <div class="input-group">
                <label for="secretKey">Secret Key:</label>
                <div class="password-input-container">
                    <input type="password" id="secretKey" value="">
                    <span class="toggle-password" id="toggleSecretKey">
                        <i class="fas fa-eye"></i>
                    </span>
                </div>
            </div>

            <h2>Parameters</h2>
            <div class="input-group">
                <label for="applicationCode">applicationCode:</label>
                <input type="text" id="applicationCode" value="">
                <p class="description">Unique code for the application.</p>
            </div>
            <div class="input-group">
                <label for="serialNo">serialNo:</label>
                <input type="text" id="serialNo" value="">
                <p class="description">Unique identity of the PIN (Optional).</p>
            </div>
            <div class="input-group">
                <label for="pin">pin:</label>
                <input type="text" id="pin" value="">
                <p class="description">PIN is a unique code.</p>
            </div>
            <div class="input-group">
                <label for="clientIpAddress">clientIpAddress:</label>
                <input type="text" id="clientIpAddress" value="">
                <p class="description">IP Address of the users who is request for redemption service.</p>
            </div>
            <div class="input-group">
                <label for="version">version:</label>
                <input type="text" id="version" value="v1" readonly>
                <p class="description">API version being used.</p>
            </div>
            <div class="input-group">
                <label for="channelId">channelId:</label>
                <input type="text" id="channelId" value="">
                <p class="description">The ID of the payment channel.</p>
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

        <div class="container pin-query-tester-section">
            <h1>Razer Gold PIN Query Tester</h1>
            <button id="sendPinQueryRequest">Send PIN Query Request</button>

            <div class="output-group">
                <label for="requestPayload">Request Parameters (GET):</label>
                <textarea id="requestPayload" rows="10" readonly></textarea>
            </div>

            <div class="output-group">
                <label for="responsePayload">Response Payload (JSON):</label>
                <textarea id="responsePayload" rows="10" readonly></textarea>
            </div>
            <div class="output-group">
                <label for="resultOutput">Result:</label>
                <div id="resultOutput"></div>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script src="{{ asset('js/pin-query-generator.js') }}"></script>
    <script src="{{ asset('js/payment-tester.js') }}"></script>
</body>
</html>