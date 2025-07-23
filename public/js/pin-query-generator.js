$(document).ready(function() {
    const HASH_TYPE = "hmac-sha256";
    const API_VERSION = "v1";

    // Helper function to show Toastr messages
    function showToast(message, type = 'success') {
        toastr.options = {
            "closeButton": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        toastr[type](message);
    }

    // Toggle password visibility
    $('#toggleSecretKey').on('click', function() {
        const secretKeyInput = $('#secretKey');
        const type = secretKeyInput.attr('type') === 'password' ? 'text' : 'password';
        secretKeyInput.attr('type', type);
        $(this).find('i').toggleClass('fa-eye fa-eye-slash');
    });

    // Function to generate HMAC-SHA256 signature
    async function generateSignature(secretKey, data) {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKey);
        const messageData = encoder.encode(data);

        const key = await crypto.subtle.importKey(
            "raw",
            keyData, {
                name: "HMAC",
                hash: {
                    name: "SHA-256"
                }
            },
            false,
            ["sign"]
        );

        const signature = await crypto.subtle.sign(
            "HMAC",
            key,
            messageData
        );

        return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Function to update concatenated string and signature
    async function updateSignature() {
        const secretKey = $('#secretKey').val();
        const applicationCode = $('#applicationCode').val();
        const serialNo = $('#serialNo').val();
        const pin = $('#pin').val();
        const clientIpAddress = $('#clientIpAddress').val();
        const version = $('#version').val(); // This is readonly, so its value is always 'v1'
        const stateId = $('#stateId').val();
        const amount = $('#amount').val();
        const currencyCode = $('#currencyCode').val();

        // Parameters for signature generation based on documentation
        // 1. applicationCode
        // 2. pin
        // 3. serialNo
        // 4. amount (conditional)
        // 5. currencyCode (conditional)
        // 6. stateId (conditional)

        let concatenatedString = '';

        // Parameters for signature generation based on documentation: applicationCode, pin, serialNo
        if (applicationCode) {
            concatenatedString += applicationCode;
        }
        if (pin) {
            concatenatedString += pin;
        }
        if (serialNo) {
            concatenatedString += serialNo;
        }

        $('#concatenatedString').val(concatenatedString);

        if (secretKey && concatenatedString) {
            const signature = await generateSignature(secretKey, concatenatedString);
            $('#generatedSignature').val(signature);
        } else {
            $('#generatedSignature').val('');
        }
    }

    // Event listeners for input changes
    $('#secretKey, #applicationCode, #serialNo, #pin, #clientIpAddress, #stateId, #amount, #currencyCode').on('input change', updateSignature);
    $('#generateButton').on('click', updateSignature);
    $('#saveButton').on('click', saveInputs);

    // Initial signature generation on page load
    loadInputs();
    updateSignature();

    // Copy signature to clipboard
    $('#copySignature').on('click', function() {
        const signatureTextarea = $('#generatedSignature');
        signatureTextarea.select();
        document.execCommand('copy');
        showToast('Signature copied to clipboard!');
    });

    // Send PIN Query Request
    $('#sendPinQueryRequest').on('click', async function() {
        const apiUrl = '/send-pin-query-proxy';
        const applicationCode = $('#applicationCode').val();
        const serialNo = $('#serialNo').val();
        const pin = $('#pin').val();
        const clientIpAddress = $('#clientIpAddress').val();
        const version = $('#version').val();
        const signature = $('#generatedSignature').val();
        const stateId = $('#stateId').val();
        const amount = $('#amount').val();
        const currencyCode = $('#currencyCode').val();

        if (!applicationCode || !pin || !clientIpAddress || !version || !signature) {
            showToast('Please fill in all required parameters (applicationCode, pin, clientIpAddress, version, signature).', 'error');
            return;
        }

        const params = {
            applicationCode: applicationCode,
            pin: pin,
            clientIpAddress: clientIpAddress,
            version: version,
            signature: signature
        };

        if (serialNo) {
            params.serialNo = serialNo;
        }
        if (stateId) {
            params.stateId = stateId;
        }
        if (amount) {
            params.amount = amount;
        }
        if (currencyCode) {
            params.currencyCode = currencyCode;
        }

        const queryString = new URLSearchParams(params).toString();
        const requestUrl = `${apiUrl}?${queryString}`;

        $('#requestPayload').val(decodeURIComponent(queryString));
        $('#loader').show();

        try {
            const response = await fetch(requestUrl); // GET request, no need for headers or body

            const data = await response.json();
            $('#responsePayload').val(JSON.stringify(data, null, 2));

            if (response.ok) {
                showToast('PIN Query request sent successfully!');
                $('#resultOutput').html(`
                    <p><strong>Status:</strong> ${data.status}</p>
                    <p><strong>Message:</strong> ${data.message}</p>
                    <p><strong>State ID:</strong> ${data.stateId || 'N/A'}</p>
                    <p><strong>Amount:</strong> ${data.amount || 'N/A'}</p>
                    <p><strong>Currency Code:</strong> ${data.currencyCode || 'N/A'}</p>
                `);
            } else {
                showToast(`Error: ${data.message || response.statusText}`, 'error');
                $('#resultOutput').html(`<p><strong>Error:</strong> ${data.message || response.statusText}</p>`);
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('An error occurred while sending the request.', 'error');
            $('#responsePayload').val(`Error: ${error.message}`);
            $('#resultOutput').html(`<p><strong>Error:</strong> ${error.message}</p>`);
        } finally {
            $('#loader').hide();
        }
    });
    // Function to save inputs to local storage
    function saveInputs() {
        const inputs = {
            secretKey: $('#secretKey').val(),
            applicationCode: $('#applicationCode').val(),
            serialNo: $('#serialNo').val(),
            pin: $('#pin').val(),
            clientIpAddress: $('#clientIpAddress').val(),
            stateId: $('#stateId').val(),
            amount: $('#amount').val(),
            currencyCode: $('#currencyCode').val()
        };
        localStorage.setItem('pinQueryInputs', JSON.stringify(inputs));
        showToast('Inputs saved successfully!');
    }

    // Function to load inputs from local storage
    function loadInputs() {
        const savedInputs = localStorage.getItem('pinQueryInputs');
        if (savedInputs) {
            const inputs = JSON.parse(savedInputs);
            $('#secretKey').val(inputs.secretKey || '');
            $('#applicationCode').val(inputs.applicationCode || '');
            $('#serialNo').val(inputs.serialNo || '');
            $('#pin').val(inputs.pin || '');
            $('#clientIpAddress').val(inputs.clientIpAddress || '');
            $('#stateId').val(inputs.stateId || '');
            $('#amount').val(inputs.amount || '');
            $('#currencyCode').val(inputs.currencyCode || '');
            showToast('Inputs loaded from local storage.');
        }
    }
});