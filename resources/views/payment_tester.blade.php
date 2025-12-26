<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Razer Gold Payment Tester</title>
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
            <h1>HMAC-SHA256 Signature Generator</h1>

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
                <label for="referenceId">referenceId:</label>
                <input type="text" id="referenceId" value="">
                <p class="description">Unique transaction reference ID.</p>
            </div>
            <div class="input-group">
                <label for="version">version:</label>
                <input type="text" id="version" value="v1" readonly>
                <p class="description">API version being used.</p>
            </div>
            <div class="input-group">
                <label for="description">description:</label>
                <input type="text" id="description" value="">
                <p class="description">Description of the product or transaction.</p>
            </div>
            <div class="input-group">
                <label for="returnUrl">returnUrl:</label>
                <input type="text" id="returnUrl" value="">
                <div class="checkbox-group">
                    <input type="checkbox" id="autoGenerateReturnUrl" checked>
                    <label for="autoGenerateReturnUrl">Auto-generate based on Reference ID</label>
                </div>
                <p class="description">URL to redirect after transaction.</p>
            </div>
            <div class="input-group">
                <label for="amount">amount:</label>
                <input type="number" id="amount" value="">
                <p class="description">Transaction amount.</p>
            </div>
            <div class="input-group">
                <label for="currencyCode">currencyCode:</label>
                <select id="currencyCode">
                    <option value="MYR" selected>MYR - Malaysian Ringgit</option>
                    <option value="USD">USD - United States Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="SGD">SGD - Singapore Dollar</option>
                    <option value="PHP">PHP - Philippine Peso</option>
                    <option value="THB">THB - Thai Baht</option>
                    <option value="IDR">IDR - Indonesian Rupiah</option>
                    <option value="VND">VND - Vietnamese Dong</option>
                </select>
                <p class="description">Currency code for the transaction.</p>
            </div>
            <div class="input-group">
                <label for="hashType">hashType:</label>
                <input type="text" id="hashType" value="hmac-sha256" readonly>
                <p class="description">Hashing algorithm used for signature.</p>
            </div>
            <div class="input-group">
                <label for="customerId">customerId:</label>
                <input type="text" id="customerId" value="">
                <p class="description">Unique identifier for the customer.</p>
            </div>
            <div class="input-group">
                <label for="channelId">channelId:</label>
                <input type="text" id="channelId" value="">
                <p class="description">Channel identifier (optional).</p>
            </div>
            <div class="input-group">
                <label for="callbackUrl">callbackUrl:</label>
                <input type="text" id="callbackUrl" value="">
                <p class="description">Callback URL for notifications (optional).</p>
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
            <h1>Razer Gold Payment Tester</h1>
            <div class="input-group">
                <label for="environmentSelect">Post to Environment:</label>
                <select id="environmentSelect">
                    <option value="sandbox">Sandbox</option>
                    <option value="dev">Dev</option>
                </select>
                <p class="description">Select the environment for the payment API.</p>
            </div>
            <div class="input-group">
                <label for="paymentApiUrl">Razer Gold Payment API URL:</label>
                <input type="text" id="paymentApiUrl" value="https://globalapi.gold-sandbox.razer.com/payout/payments" readonly>
                <p class="description">The endpoint for Razer Gold Payment API.</p>
            </div>
            <button id="sendPaymentRequest">Send Payment Request</button>

            <div class="output-group">
                <label for="requestPayload">Request Payload (x-www-form-urlencoded):</label>
                <textarea id="requestPayload" rows="10" readonly></textarea>
            </div>

            <div class="output-group">
                <label for="responsePayload">Response Payload (JSON):</label>
                <textarea id="responsePayload" rows="10" readonly></textarea>
            </div>
            <div class="output-group">
                <label for="paymentUrlOutput">Payment URL:</label>
                <div id="paymentUrlOutput"></div>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script src="{{ asset('js/payment-tester.js') }}"></script>
</body>
</html>