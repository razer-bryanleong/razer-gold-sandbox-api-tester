document.addEventListener('DOMContentLoaded', () => {
    const secretKeyInput = document.getElementById('secretKey');
    const toggleSecretKey = document.getElementById('toggleSecretKey');
    const applicationCodeInput = document.getElementById('applicationCode');
    const referenceIdInput = document.getElementById('referenceId');
    const versionInput = document.getElementById('version');
    const descriptionInput = document.getElementById('description');
    const returnUrlInput = document.getElementById('returnUrl');
    const amountInput = document.getElementById('amount');
    const currencyCodeInput = document.getElementById('currencyCode');
    const hashTypeInput = document.getElementById('hashType');
    const customerIdInput = document.getElementById('customerId');
    const channelIdInput = document.getElementById('channelId');
    const callbackUrlInput = document.getElementById('callbackUrl');
    const concatenatedStringOutput = document.getElementById('concatenatedString');
    const generatedSignatureOutput = document.getElementById('generatedSignature');
    const copySignatureButton = document.getElementById('copySignature');
    const paymentApiUrlInput = document.getElementById('paymentApiUrl');
    const sendPaymentRequestButton = document.getElementById('sendPaymentRequest');
    const requestPayloadOutput = document.getElementById('requestPayload');
    const responsePayloadOutput = document.getElementById('responsePayload');
    const paymentUrlOutput = document.getElementById('paymentUrlOutput');
    const generateButton = document.getElementById('generateButton');
    const loader = document.getElementById('loader');

   const environmentSelect = document.getElementById('environmentSelect');

   const apiUrls = {
       sandbox: 'https://globalapi.gold-sandbox.razer.com/payout/payments',
       dev: 'https://globalapi.zgold-dev.razer.com/payout/payments'
   };

   if (environmentSelect) {
       environmentSelect.addEventListener('change', (event) => {
           const selectedEnv = event.target.value;
           paymentApiUrlInput.value = apiUrls[selectedEnv];
       });
   }

    // Toastr options
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
    };

    const razerErrorMessages = {
        400: "Bad Request - The server rejected the request due to a syntax error or insufficient information.",
        401: "Unauthorized - The request was rejected due to an authentication failure. Check your server's IP address.",
        404: "Not Found - The requested resource does not exist.",
        500: "Internal Server Error - An error occurred on the Razer Gold server.",
        503: "Service Unavailable - The Razer Gold service is temporarily unavailable.",
    };

    const razerDetailedErrorMessages = {
        40001: "Required parameter is missing or parameter format is invalid.",
        40002: "Invalid API Version.",
        40003: "Invalid Currency Code or not supported.",
        40004: "Duplicate Reference Id or Currency Code/Pin mismatch with previous transaction.",
        40005: "Invalid Channel Id.",
        40006: "Invalid Amount.",
        40007: "Invalid PIN.",
        40008: "Invalid Client IP Address.",
        40009: "The transaction was declined by Razer Gold because of possible fraudulent activity.",
        40013: "Payment Amount Exceeds channel maximum accepted amount.",
        40014: "Payment Amount less than channel minimum accepted amount.",
        40015: "Invalid SubChannelCode.",
        40101: "Invalid Application Code.",
        40102: "Unauthorized Server IP Address.",
        40103: "Invalid Signature.",
        40104: "Channel Id not permitted.",
        40400: "Payment not found."
    };

    // Attach event listener to the Save button
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', saveData);
    }

    // Load saved data on page load
    loadData();

    toggleSecretKey.addEventListener('click', () => {
        const type = secretKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
        secretKeyInput.setAttribute('type', type);
        toggleSecretKey.querySelector('i').classList.toggle('fa-eye');
        toggleSecretKey.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Add an event listener to the referenceId input to dynamically update the returnUrl
    referenceIdInput.addEventListener('input', () => {
        returnUrlInput.value = `http://127.0.0.1:8000/result?referenceId=${referenceIdInput.value}`;
    });

    async function generateSignature() {
        const secretKey = secretKeyInput.value;
        const params = {
            applicationCode: applicationCodeInput.value,
            referenceId: referenceIdInput.value,
            version: versionInput.value,
            description: descriptionInput.value,
            returnUrl: `http://127.0.0.1:8000/result?referenceId=${referenceIdInput.value}`,
            amount: amountInput.value,
            currencyCode: currencyCodeInput.value,
            hashType: hashTypeInput.value,
            customerId: customerIdInput.value,
            channelId: channelIdInput.value,
            callbackUrl: callbackUrlInput.value
        };

        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([, value]) => value !== '')
        );

        const sortedKeys = Object.keys(filteredParams).sort();
        let concatenatedString = '';
        for (const key of sortedKeys) {
            concatenatedString += filteredParams[key];
        }
        concatenatedStringOutput.value = concatenatedString;

        try {
            const encoder = new TextEncoder();
            const keyData = encoder.encode(secretKey);
            const algo = { name: "HMAC", hash: { name: "SHA-256" } };
            const cryptoKey = await crypto.subtle.importKey("raw", keyData, algo, false, ["sign"]);
            const signatureBuffer = await crypto.subtle.sign(algo, cryptoKey, encoder.encode(concatenatedString));
            const hashArray = Array.from(new Uint8Array(signatureBuffer));
            const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            generatedSignatureOutput.value = signature;
            return signature;
        } catch (error) {
            console.error("Error generating signature:", error);
            generatedSignatureOutput.value = "Error generating signature. Check console for details.";
            toastr.error('Error generating signature. Check console for details.');
            return null;
        }
    }

    generateButton.addEventListener('click', generateSignature);

    sendPaymentRequestButton.addEventListener('click', async () => {
        const signature = await generateSignature();
        if (!signature) return;

        const proxyUrl = '/send-payment-proxy';
        const requestBody = {
            applicationCode: applicationCodeInput.value,
            referenceId: referenceIdInput.value,
            version: versionInput.value,
            description: descriptionInput.value,
            returnUrl: returnUrlInput.value,
            amount: parseFloat(amountInput.value),
            currencyCode: currencyCodeInput.value,
            hashType: hashTypeInput.value,
            customerId: customerIdInput.value,
            channelId: channelIdInput.value,
            callbackUrl: callbackUrlInput.value,
            signature: signature
        };

        // Filter out empty values for the request payload
        const filteredRequestBody = Object.fromEntries(
            Object.entries(requestBody).filter(([, value]) => value !== '' && value !== null)
        );

        // Convert to x-www-form-urlencoded
        const formBody = Object.keys(filteredRequestBody).map(key => {
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(filteredRequestBody[key]);
            return `${encodedKey}=${encodedValue}`;
        }).join('&');

        requestPayloadOutput.value = formBody; // Display x-www-form-urlencoded string

        loader.style.display = 'flex'; // Show loader

        try {
            const response = await fetch(proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-API-URL': paymentApiUrlInput.value
                },
                body: formBody
            });

            const responseData = await response.json();
            responsePayloadOutput.value = JSON.stringify(responseData, null, 2);

            if (!response.ok) {
                console.error("API Error:", responseData);
                let errorMessage = razerErrorMessages[response.status] || `API Error: ${responseData.message || response.statusText}`;

                if (responseData.code && razerDetailedErrorMessages[responseData.code]) {
                    errorMessage = `Error ${responseData.code}: ${razerDetailedErrorMessages[responseData.code]}`;
                } else if (responseData.message) {
                    errorMessage = `API Error: ${responseData.message}`;
                }

                toastr.error(errorMessage);
                paymentUrlOutput.innerHTML = ''; // Clear previous link
            } else {
                toastr.success('Payment request sent successfully! Check response payload.');
                if (responseData.paymentUrl) {
                    const link = document.createElement('a');
                    link.href = responseData.paymentUrl;
                    link.textContent = responseData.paymentUrl;
                    link.target = '_blank';
                    paymentUrlOutput.innerHTML = ''; // Clear previous link
                    paymentUrlOutput.appendChild(link);
                }
            }

        } catch (error) {
            console.error("Error sending payment request:", error);
            responsePayloadOutput.value = `Error: ${error.message}`;
            toastr.error('Error sending payment request. Check console for details.');
        } finally {
            loader.style.display = 'none'; // Hide loader
        }
    });

    function copySignature() {
        generatedSignatureOutput.select();
        generatedSignatureOutput.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand('copy');
        toastr.success('Signature copied to clipboard!');
    }

    copySignatureButton.addEventListener('click', copySignature);

    function saveData() {
        const data = {
            secretKey: secretKeyInput.value,
            applicationCode: applicationCodeInput.value,
            referenceId: referenceIdInput.value,
            description: descriptionInput.value,
            returnUrl: returnUrlInput.value,
            amount: amountInput.value,
            currencyCode: currencyCodeInput.value,
            customerId: customerIdInput.value,
            channelId: channelIdInput.value,
            callbackUrl: callbackUrlInput.value
        };
        localStorage.setItem('signatureGeneratorData', JSON.stringify(data));
    }

    function loadData() {
        const savedData = localStorage.getItem('signatureGeneratorData');
        if (savedData) {
            const data = JSON.parse(savedData);
            secretKeyInput.value = data.secretKey || '';
            applicationCodeInput.value = data.applicationCode || '';
            referenceIdInput.value = data.referenceId || '';
            descriptionInput.value = data.description || '';
            returnUrlInput.value = data.returnUrl || 'http://localhost:8000/razer/return';
            amountInput.value = data.amount || '';
            currencyCodeInput.value = data.currencyCode || 'MYR';
            customerIdInput.value = data.customerId || '';
            channelIdInput.value = data.channelId || '';
            callbackUrlInput.value = data.callbackUrl || '';
        }
    }
    const navbarToggler = document.getElementById('navbarToggler');
    const navbarLinks = document.getElementById('navbarLinks');
    const verticalNavbar = document.getElementById('verticalNavbar'); // Get the vertical navbar element

    if (navbarToggler && navbarLinks && verticalNavbar) {
        navbarToggler.addEventListener('click', () => {
            // Toggle 'collapsed' class for desktop vertical collapse/expand
            verticalNavbar.classList.toggle('collapsed');
            // Toggle 'active' class for mobile responsiveness
            navbarLinks.classList.toggle('active');
        });
    }
});