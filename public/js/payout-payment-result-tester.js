document.addEventListener('DOMContentLoaded', () => {
    const secretKeyInput = document.getElementById('secretKey');
    const toggleSecretKey = document.getElementById('toggleSecretKey');
    const applicationCodeInput = document.getElementById('applicationCode');
    const referenceIdInput = document.getElementById('referenceId');
    const versionInput = document.getElementById('version');
    const amountInput = document.getElementById('amount');
    const currencyCodeInput = document.getElementById('currencyCode');
    const paymentIdInput = document.getElementById('paymentId');
    const paymentStatusCodeInput = document.getElementById('paymentStatusCode');
    const paymentStatusDateInput = document.getElementById('paymentStatusDate');
    const channelIdInput = document.getElementById('channelId');
    const customerIdInput = document.getElementById('customerId');
    const virtualCurrencyAmountInput = document.getElementById('virtualCurrencyAmount');
    const hashTypeInput = document.getElementById('hashType');
    const concatenatedStringOutput = document.getElementById('concatenatedString');
    const generatedSignatureOutput = document.getElementById('generatedSignature');
    const copySignatureButton = document.getElementById('copySignature');
    const generateButton = document.getElementById('generateButton');
    const saveButton = document.getElementById('saveButton');
    const loadSampleButton = document.getElementById('loadSampleButton');
    const payoutCallbackUrlInput = document.getElementById('payoutCallbackUrl');
    const sendPayoutResultButton = document.getElementById('sendPayoutResult');
    const requestPayloadOutput = document.getElementById('requestPayload');
    const responsePayloadOutput = document.getElementById('responsePayload');
    const loader = document.getElementById('loader');

    // Toastr options
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
    };

    // Load saved data on page load
    loadData();

    toggleSecretKey.addEventListener('click', () => {
        const type = secretKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
        secretKeyInput.setAttribute('type', type);
        toggleSecretKey.querySelector('i').classList.toggle('fa-eye');
        toggleSecretKey.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Set current UTC time for paymentStatusDate on load
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = now.getUTCDate().toString().padStart(2, '0');
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    const seconds = now.getUTCSeconds().toString().padStart(2, '0');
    paymentStatusDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    async function generateSignature() {
        const secretKey = secretKeyInput.value;
        const params = {
            applicationCode: applicationCodeInput.value,
            referenceId: referenceIdInput.value,
            version: versionInput.value,
            amount: amountInput.value,
            currencyCode: currencyCodeInput.value,
            paymentId: paymentIdInput.value,
            paymentStatusCode: paymentStatusCodeInput.value,
            paymentStatusDate: paymentStatusDateInput.value + 'Z', // Append 'Z' for UTC
            channelId: channelIdInput.value,
            customerId: customerIdInput.value,
            virtualCurrencyAmount: virtualCurrencyAmountInput.value,
            hashType: hashTypeInput.value
        };

        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([, value]) => value !== '' && value !== null)
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

    saveButton.addEventListener('click', () => {
        saveData();
        toastr.success('Inputs saved successfully!');
    });

    loadSampleButton.addEventListener('click', () => {
        loadSampleData();
        toastr.success('Sample values loaded!');
    });

    copySignatureButton.addEventListener('click', () => {
        generatedSignatureOutput.select();
        generatedSignatureOutput.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand('copy');
        toastr.success('Signature copied to clipboard!');
    });

    sendPayoutResultButton.addEventListener('click', async () => {
        const signature = await generateSignature();
        if (!signature) return;

        const callbackUrl = payoutCallbackUrlInput.value;
        if (!callbackUrl) {
            toastr.error('Payout Callback URL cannot be empty.');
            return;
        }

        const requestBody = {
            applicationCode: applicationCodeInput.value,
            referenceId: referenceIdInput.value,
            version: versionInput.value,
            amount: parseFloat(amountInput.value),
            currencyCode: currencyCodeInput.value,
            paymentId: paymentIdInput.value,
            paymentStatusCode: paymentStatusCodeInput.value,
            paymentStatusDate: paymentStatusDateInput.value + 'Z',
            channelId: channelIdInput.value,
            customerId: customerIdInput.value,
            virtualCurrencyAmount: virtualCurrencyAmountInput.value,
            hashType: hashTypeInput.value,
            signature: signature
        };

        const filteredRequestBody = Object.fromEntries(
            Object.entries(requestBody).filter(([, value]) => value !== '' && value !== null && value !== undefined)
        );

        const formBody = Object.keys(filteredRequestBody).map(key => {
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(filteredRequestBody[key]);
            return `${encodedKey}=${encodedValue}`;
        }).join('&');

        requestPayloadOutput.value = formBody;
        loader.style.display = 'flex';

        try {
            const response = await fetch(callbackUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: formBody
            });

            const responseText = await response.text();
            responsePayloadOutput.value = responseText;

            if (!response.ok) {
                console.error("Callback URL Error:", responseText);
                toastr.error(`Error sending payout result: ${response.status} ${response.statusText}`);
            } else {
                toastr.success('Payout result sent successfully! Check response from callback.');
            }

        } catch (error) {
            console.error("Error sending payout result:", error);
            responsePayloadOutput.value = `Error: ${error.message}`;
            toastr.error('Error sending payout result. Check console for details.');
        } finally {
            loader.style.display = 'none';
        }
    });

    function saveData() {
        const data = {
            secretKey: secretKeyInput.value,
            applicationCode: applicationCodeInput.value,
            referenceId: referenceIdInput.value,
            amount: amountInput.value,
            currencyCode: currencyCodeInput.value,
            paymentId: paymentIdInput.value,
            paymentStatusCode: paymentStatusCodeInput.value,
            paymentStatusDate: paymentStatusDateInput.value,
            channelId: channelIdInput.value,
            customerId: customerIdInput.value,
            virtualCurrencyAmount: virtualCurrencyAmountInput.value,
            payoutCallbackUrl: payoutCallbackUrlInput.value
        };
        localStorage.setItem('payoutResultGeneratorData', JSON.stringify(data));
    }

    function loadSampleData() {
        secretKeyInput.value = 'Ziu61T9xY227aazS530Pk8C5424y663r';
        applicationCodeInput.value = '3f2504e04f8911d39a0c0305e82c3301';
        referenceIdInput.value = 'TRX1708901';
        versionInput.value = 'v1';
        amountInput.value = '1000';
        currencyCodeInput.value = 'MYR';
        paymentIdInput.value = 'MPO000000000001';
        paymentStatusCodeInput.value = '00';
        paymentStatusDateInput.value = '2012-12-31T14:59:59';
        channelIdInput.value = '';
        customerIdInput.value = '12321144221';
        virtualCurrencyAmountInput.value = '';
        hashTypeInput.value = 'hmac-sha256';
        payoutCallbackUrlInput.value = 'http://127.0.0.1:8000/razer/payout-callback';
    }

    function loadSampleData() {
        secretKeyInput.value = 'Ziu61T9xY227aazS530Pk8C5424y663r';
        applicationCodeInput.value = '3f2504e04f8911d39a0c0305e82c3301';
        referenceIdInput.value = 'TRX1708901';
        versionInput.value = 'v1';
        amountInput.value = '1000';
        currencyCodeInput.value = 'MYR';
        paymentIdInput.value = 'MPO000000000001';
        paymentStatusCodeInput.value = '00';
        paymentStatusDateInput.value = '2012-12-31T14:59:59';
        channelIdInput.value = '';
        customerIdInput.value = '12321144221';
        virtualCurrencyAmountInput.value = '';
        hashTypeInput.value = 'hmac-sha256';
        payoutCallbackUrlInput.value = 'http://127.0.0.1:8000/razer/payout-callback';
    }

    function loadData() {
        const savedData = localStorage.getItem('payoutResultGeneratorData');
        if (savedData) {
            const data = JSON.parse(savedData);
            secretKeyInput.value = data.secretKey || '';
            applicationCodeInput.value = data.applicationCode || '';
            referenceIdInput.value = data.referenceId || '';
            amountInput.value = data.amount || '';
            currencyCodeInput.value = data.currencyCode || 'MYR';
            paymentIdInput.value = data.paymentId || '';
            paymentStatusCodeInput.value = data.paymentStatusCode || '00';
            paymentStatusDateInput.value = data.paymentStatusDate || paymentStatusDateInput.value;
            channelIdInput.value = data.channelId || '';
            customerIdInput.value = data.customerId || '';
            virtualCurrencyAmountInput.value = data.virtualCurrencyAmount || '';
            payoutCallbackUrlInput.value = data.payoutCallbackUrl || 'http://127.0.0.1:8000/razer/payout-callback';
        }
    }

    const navbarToggler = document.getElementById('navbarToggler');
    const navbarLinks = document.getElementById('navbarLinks');
    const verticalNavbar = document.getElementById('verticalNavbar'); 

    if (navbarToggler && navbarLinks && verticalNavbar) {
        navbarToggler.addEventListener('click', () => {
            verticalNavbar.classList.toggle('collapsed');
            navbarLinks.classList.toggle('active');
        });
    }
});