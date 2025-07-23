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
    const generateButton = document.getElementById('generateSignature');
    const concatenatedStringOutput = document.getElementById('concatenatedString');
    const generatedSignatureOutput = document.getElementById('generatedSignature');
    const copySignatureButton = document.getElementById('copySignature');

    // Load saved data on page load
    loadData();

    toggleSecretKey.addEventListener('click', () => {
        const type = secretKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
        secretKeyInput.setAttribute('type', type);
        toggleSecretKey.querySelector('i').classList.toggle('fa-eye');
        toggleSecretKey.querySelector('i').classList.toggle('fa-eye-slash');
    });

    generateButton.addEventListener('click', async () => {
        const secretKey = secretKeyInput.value;
        const params = {
            applicationCode: applicationCodeInput.value,
            referenceId: referenceIdInput.value,
            version: versionInput.value,
            description: descriptionInput.value,
            returnUrl: returnUrlInput.value,
            amount: amountInput.value,
            currencyCode: currencyCodeInput.value,
            hashType: hashTypeInput.value,
            customerId: customerIdInput.value,
            channelId: channelIdInput.value,
            callbackUrl: callbackUrlInput.value
        };

        // Step 1: Sort parameters by name alphabetically and concatenate their values
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([, value]) => value !== '')
        );

        const sortedKeys = Object.keys(filteredParams).sort();
        let concatenatedString = '';
        for (const key of sortedKeys) {
            concatenatedString += filteredParams[key];
        }
        concatenatedStringOutput.value = concatenatedString; // Display concatenated string

        // Step 3: Hash the concatenated string using HMAC-SHA256 algorithm
        try {
            const encoder = new TextEncoder();
            const keyData = encoder.encode(secretKey);
            const algo = { name: "HMAC", hash: { name: "SHA-256" } };
            const cryptoKey = await crypto.subtle.importKey(
                "raw",
                keyData,
                algo,
                false,
                ["sign"]
            );

            const signature = await crypto.subtle.sign(
                algo,
                cryptoKey,
                encoder.encode(concatenatedString)
            );

            const hashArray = Array.from(new Uint8Array(signature));
            const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            generatedSignatureOutput.value = hexHash;
            saveData(); // Save data after successful generation

        } catch (error) {
            console.error("Error generating signature:", error);
            generatedSignatureOutput.value = "Error generating signature. Check console for details.";
        }
    });

    copySignatureButton.addEventListener('click', () => {
        generatedSignatureOutput.select();
        generatedSignatureOutput.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand('copy');
        alert('Signature copied to clipboard!');
    });

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
            returnUrlInput.value = data.returnUrl || '';
            amountInput.value = data.amount || '';
            currencyCodeInput.value = data.currencyCode || 'MYR';
            customerIdInput.value = data.customerId || '';
            channelIdInput.value = data.channelId || '';
            callbackUrlInput.value = data.callbackUrl || '';
        }
    }
});