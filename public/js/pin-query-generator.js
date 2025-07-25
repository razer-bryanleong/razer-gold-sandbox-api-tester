/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
var md5 = (function () {
    function c(q, a, b, x, s, t) {
        return d((a & b) | (~a & x), q, a, s, t);
    }
    function f(q, a, b, x, s, t) {
        return d((a & x) | (b & ~x), q, a, s, t);
    }
    function g(q, a, b, x, s, t) {
        return d(a ^ b ^ x, q, a, s, t);
    }
    function h(q, a, b, x, s, t) {
        return d(b ^ (a | ~x), q, a, s, t);
    }
    function d(q, a, b, s, t) {
        var p = (q & 0xFFFF) + (a & 0xFFFF) + (b & 0xFFFF) + (s & 0xFFFF) + (t & 0xFFFF);
        return (p << 16) | (p >>> 16);
    }
    var k = "0123456789abcdef";
    function l(n) {
        var str = "";
        for (var j = 0; j < 4; j++) {
            str += k.charAt((n >> (j * 8 + 4)) & 0x0F) + k.charAt((n >> (j * 8)) & 0x0F);
        }
        return str;
    }
    function m(s) {
        var n = (s.length + 8) & ~7, a = new Array(n / 4);
        for (var i = 0; i < n / 4; i++) a[i] = 0;
        for (i = 0; i < s.length; i++) a[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8);
        a[i >> 2] |= 0x80 << ((i % 4) * 8);
        a[n / 4 - 2] = s.length * 8;
        return a;
    }
    return function (s) {
        var x = m(s);
        var a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var aa = a, bb = b, cc = c, dd = d;
            a = c(a, b, c, d, x[i + 0], 7, -680876936);
            d = c(d, a, b, c, x[i + 1], 12, -389564586);
            c = c(c, d, a, b, x[i + 2], 17, 606105819);
            b = c(b, c, d, a, x[i + 3], 22, -1044525330);
            a = c(a, b, c, d, x[i + 4], 7, -176418897);
            d = c(d, a, b, c, x[i + 5], 12, 1200080426);
            c = c(c, d, a, b, x[i + 6], 17, -1473231341);
            b = c(b, c, d, a, x[i + 7], 22, -45705983);
            a = c(a, b, c, d, x[i + 8], 7, 1770035416);
            d = c(d, a, b, c, x[i + 9], 12, -1958414417);
            c = c(c, d, a, b, x[i + 10], 17, -42063);
            b = c(b, c, d, a, x[i + 11], 22, -1990404162);
            a = c(a, b, c, d, x[i + 12], 7, 1804603682);
            d = c(d, a, b, c, x[i + 13], 12, -40341101);
            c = c(c, d, a, b, x[i + 14], 17, -1502002290);
            b = c(b, c, d, a, x[i + 15], 22, 1236535329);
            a = f(a, b, c, d, x[i + 1], 5, -165796510);
            d = f(d, a, b, c, x[i + 6], 9, -1069501632);
            c = f(c, d, a, b, x[i + 11], 14, 643717713);
            b = f(b, c, d, a, x[i + 0], 20, -373897302);
            a = f(a, b, c, d, x[i + 5], 5, -701558691);
            d = f(d, a, b, c, x[i + 10], 9, 38016083);
            c = f(c, d, a, b, x[i + 15], 14, -660478335);
            b = f(b, c, d, a, x[i + 4], 20, -405537848);
            a = f(a, b, c, d, x[i + 9], 5, 568446438);
            d = f(d, a, b, c, x[i + 14], 9, -1019803690);
            c = f(c, d, a, b, x[i + 3], 14, -187363961);
            b = f(b, c, d, a, x[i + 8], 20, 1163531501);
            a = f(a, b, c, d, x[i + 13], 5, -1444681467);
            d = f(d, a, b, c, x[i + 2], 9, -51403784);
            c = f(c, d, a, b, x[i + 7], 14, 1735328473);
            b = f(b, c, d, a, x[i + 12], 20, -1926607734);
            a = g(a, b, c, d, x[i + 5], 4, -378558);
            d = g(d, a, b, c, x[i + 8], 11, -2022574463);
            c = g(c, d, a, b, x[i + 11], 16, 1839030562);
            b = g(b, c, d, a, x[i + 14], 23, -35309556);
            a = g(a, b, c, d, x[i + 1], 4, -1530992060);
            d = g(d, a, b, c, x[i + 4], 11, 1272893353);
            c = g(c, d, a, b, x[i + 7], 16, -155497632);
            b = g(b, c, d, a, x[i + 10], 23, -1094730640);
            a = g(a, b, c, d, x[i + 13], 4, 681279174);
            d = g(d, a, b, c, x[i + 0], 11, -358537222);
            c = g(c, d, a, b, x[i + 3], 16, -722521979);
            b = g(b, c, d, a, x[i + 6], 23, 76029189);
            a = g(a, b, c, d, x[i + 9], 4, -640364487);
            d = g(d, a, b, c, x[i + 12], 11, -421815835);
            c = g(c, d, a, b, x[i + 15], 16, 530742520);
            b = g(b, c, d, a, x[i + 2], 23, -995338651);
            a = h(a, b, c, d, x[i + 0], 6, -198630844);
            d = h(d, a, b, c, x[i + 7], 10, 1126891415);
            c = h(c, d, a, b, x[i + 14], 15, -1416354905);
            b = h(b, c, d, a, x[i + 5], 21, -57434055);
            a = h(a, b, c, d, x[i + 12], 6, 1700485571);
            d = h(d, a, b, c, x[i + 3], 10, -1894986606);
            c = h(c, d, a, b, x[i + 10], 15, -1051523);
            b = h(b, c, d, a, x[i + 1], 21, -2054922799);
            a = h(a, b, c, d, x[i + 8], 6, 1873313359);
            d = h(d, a, b, c, x[i + 15], 10, -30611744);
            c = h(c, d, a, b, x[i + 6], 15, -1560198380);
            b = h(b, c, d, a, x[i + 13], 21, 1309151649);
            a = h(a, b, c, d, x[i + 4], 6, -145523070);
            d = h(d, a, b, c, x[i + 11], 10, -1120210379);
            c = h(c, d, a, b, x[i + 2], 15, 718787259);
            b = h(b, c, d, a, x[i + 9], 21, -343485551);
            a = d(a, aa);
            b = d(b, bb);
            c = d(c, cc);
            d = d(d, dd);
        }
        return l(a) + l(b) + l(c) + l(d);
    };
})();

$(document).ready(function() {
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

    // Function to update concatenated string and signature
    function updateSignature() {
        const secretKey = $('#secretKey').val();
        const applicationCode = $('#applicationCode').val();
        const pin = $('#pin').val();
        const serialNo = $('#serialNo').val();

        // Concatenation order as per the final documentation:
        const concatenatedString = applicationCode + pin + serialNo;

        $('#concatenatedString').val(concatenatedString);

        if (secretKey && concatenatedString) {
            // Use Laravel backend to generate MD5 signature
            $.ajax({
                url: '/generate-pin-query-signature',
                method: 'POST',
                data: {
                    _token: $('meta[name="csrf-token"]').attr('content'),
                    secretKey: secretKey,
                    data: concatenatedString
                },
                success: function(response) {
                    $('#generatedSignature').val(response.signature);
                    showToast('Signature generated successfully!');
                },
                error: function(xhr) {
                    showToast('Error generating signature: ' + xhr.responseText, 'error');
                }
            });
        } else {
            $('#generatedSignature').val('');
        }
    }

    // Event listeners for input changes
    $('#secretKey, #applicationCode, #serialNo, #pin, #clientIpAddress, #stateId, #amount, #currencyCode, #version').on('input change', updateSignature);
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