$(document).ready(function() {
    const loader = $('#loader');

    function showLoader() {
        loader.show();
    }

    function hideLoader() {
        loader.hide();
    }

    // Toggle password visibility
    $('#toggleSecretKey').on('click', function() {
        const secretKeyInput = $('#secretKey');
        const type = secretKeyInput.attr('type') === 'password' ? 'text' : 'password';
        secretKeyInput.attr('type', type);
        $(this).find('i').toggleClass('fa-eye fa-eye-slash');
    });

    // Function to generate HMAC-SHA256 signature
    function generateSignature() {
        const secretKey = $('#secretKey').val();
        const applicationCode = $('#applicationCode').val();
        const referenceId = $('#referenceId').val();
        const paymentId = $('#paymentId').val();
        const version = $('#version').val();
        const hashType = $('#hashType').val();

        // Construct the concatenated string based on the documentation for Payment Query
        // Parameters: applicationCode, referenceId (conditional), paymentId (conditional), version, hashType
        const params = {
            applicationCode: applicationCode,
            referenceId: referenceId,
            paymentId: paymentId,
            version: version,
            hashType: hashType
        };

        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([, value]) => value !== '')
        );

        const sortedKeys = Object.keys(filteredParams).sort();
        let concatenatedString = '';
        for (const key of sortedKeys) {
            concatenatedString += filteredParams[key];
        }

        $('#concatenatedString').val(concatenatedString);

        // Use Laravel backend to generate HMAC-SHA256 signature
        showLoader();
        $.ajax({
            url: '/generate-signature', // This endpoint will be created in web.php and handled by RazerPaymentController
            method: 'POST',
            data: {
                _token: $('meta[name="csrf-token"]').attr('content'),
                secretKey: secretKey,
                data: concatenatedString
            },
            success: function(response) {
                $('#generatedSignature').val(response.signature);
                toastr.success('Signature generated successfully!');
            },
            error: function(xhr) {
                toastr.error('Error generating signature: ' + xhr.responseText);
            },
            complete: function() {
                hideLoader();
            }
        });
    }

    // Attach event listener to the Generate Signature button
    $('#generateButton').on('click', generateSignature);

    // Copy signature to clipboard
    $('#copySignature').on('click', function() {
        const signatureTextarea = $('#generatedSignature');
        signatureTextarea.select();
        document.execCommand('copy');
        toastr.info('Signature copied to clipboard!');
    });

    // Send Payment Query Request
    $('#sendPaymentQueryRequest').on('click', function() {
        const paymentQueryApiUrl = $('#paymentQueryApiUrl').val();
        const applicationCode = $('#applicationCode').val();
        const referenceId = $('#referenceId').val();
        const paymentId = $('#paymentId').val();
        const version = $('#version').val();
        const hashType = $('#hashType').val();
        const signature = $('#generatedSignature').val();

        let requestData = {
            applicationCode: applicationCode,
            version: version,
            hashType: hashType,
            signature: signature
        };

        if (referenceId) {
            requestData.referenceId = referenceId;
        } else if (paymentId) { // Only include paymentId if referenceId is not present
            requestData.paymentId = paymentId;
        }

        const queryString = Object.keys(requestData)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(requestData[key])}`)
            .join('&');

        const fullUrl = `${paymentQueryApiUrl}?${queryString}`;

        $('#requestPayload').val(fullUrl);

        showLoader();
        $.ajax({
            url: '/proxy-payment-query', // This endpoint will be created in web.php and handled by RazerPaymentController
            method: 'GET', // Payment Query uses GET method
            data: requestData, // Send parameters as data for GET request
            headers: {
                'X-API-URL': paymentQueryApiUrl
            },
            success: function(response) {
                $('#responsePayload').val(JSON.stringify(response, null, 2));
                toastr.success('Payment Query request sent successfully!');
                displayPaymentDetails(response);
            },
            error: function(xhr) {
                $('#responsePayload').val(JSON.stringify(xhr.responseJSON || xhr.responseText, null, 2));
                toastr.error('Error sending Payment Query request: ' + (xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText));
            },
            complete: function() {
                hideLoader();
            }
        });
    });

    // Function to save input data to local storage
    function saveData() {
        const data = {
            secretKey: $('#secretKey').val(),
            applicationCode: $('#applicationCode').val(),
            referenceId: $('#referenceId').val(),
            paymentId: $('#paymentId').val(),
            version: $('#version').val(),
            hashType: $('#hashType').val(),
            paymentQueryApiUrl: $('#paymentQueryApiUrl').val()
        };
        localStorage.setItem('paymentQueryTesterData', JSON.stringify(data));
        toastr.success('Input data saved to local storage!');
    }

    // Function to load input data from local storage
    function loadData() {
        const savedData = localStorage.getItem('paymentQueryTesterData');
        if (savedData) {
            const data = JSON.parse(savedData);
            $('#secretKey').val(data.secretKey || '');
            $('#applicationCode').val(data.applicationCode || '');
            $('#referenceId').val(data.referenceId || '');
            $('#paymentId').val(data.paymentId || '');
            $('#version').val(data.version || 'v1');
            $('#hashType').val(data.hashType || 'hmac-sha256');
            $('#paymentQueryApiUrl').val(data.paymentQueryApiUrl || 'https://globalapi.gold-sandbox.razer.com/payout/payments');
            // Do NOT regenerate signature here, as per user request.
            // Signature will be generated only when the button is clicked.
        }
    }

    // Attach event listener to the Save button
    $('#saveButton').on('click', saveData);

    // Load data on page load
    loadData();
 
    const environmentSelect = $('#environmentSelect');
    const paymentQueryApiUrlInput = $('#paymentQueryApiUrl');
    const apiUrls = {
        sandbox: 'https://globalapi.gold-sandbox.razer.com/payout/payments',
        dev: 'https://globalapi.zgold-dev.razer.com/payout/payments'
    };
 
    if (environmentSelect.length) {
        environmentSelect.on('change', function() {
            const selectedEnv = $(this).val();
            paymentQueryApiUrlInput.val(apiUrls[selectedEnv]);
        });
    }

    function displayPaymentDetails(data) {
        const paymentDetailsOutput = $('#paymentDetailsOutput');
        paymentDetailsOutput.empty(); // Clear previous content

        if (Object.keys(data).length === 0) {
            paymentDetailsOutput.append('<p class="no-data">No payment details found for the given query.</p>');
            return;
        }

        const paymentStatusCodes = {
            "00": { text: "Success", class: "status-success" },
            "01": { text: "Incomplete", class: "status-incomplete" },
            "02": { text: "Expired", class: "status-expired" },
            "03": { text: "Cancelled", class: "status-cancelled" },
            "99": { text: "Failure", class: "status-failure" },
            "93": { text: "InvalidOtp", class: "status-failure" },
            "94": { text: "ExceedDailyLimit", class: "status-failure" },
            "95": { text: "ExceedMonthlyLimit", class: "status-failure" },
            "96": { text: "UserBlocked", class: "status-failure" },
            "97": { text: "InvalidAccount", class: "status-failure" },
            "98": { text: "InsufficientFund", class: "status-failure" },
        };

        const details = [
            { label: "Payment ID", value: data.paymentId },
            { label: "Reference ID", value: data.referenceId },
            { label: "Payment Status", value: paymentStatusCodes[data.paymentStatusCode] ? paymentStatusCodes[data.paymentStatusCode].text : data.paymentStatusCode, class: paymentStatusCodes[data.paymentStatusCode] ? paymentStatusCodes[data.paymentStatusCode].class : '' },
            { label: "Payment Status Date", value: data.paymentStatusDate },
            { label: "Amount", value: data.amount },
            { label: "Currency Code", value: data.currencyCode },
            { label: "Customer ID", value: data.customerId },
            { label: "Virtual Currency Amount", value: data.virtualCurrencyAmount },
        ];

        details.forEach(item => {
            if (item.value !== undefined && item.value !== null && item.value !== '') {
                const p = $(`<p><strong>${item.label}:</strong> <span class="${item.class}">${item.value}</span></p>`);
                paymentDetailsOutput.append(p);
            }
        });
    }
});