<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Razer Gold Return URL</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .container {
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        pre {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Razer Gold Return URL Data</h1>

        @php
            $paymentStatusCodes = [
                '00' => 'Success - Payment completed and paid.',
                '01' => 'Incomplete - Payment is not complete or in the middle of processing.',
                '02' => 'Expired - Payment has been failed as expired.',
                '03' => 'Cancelled - Payment failed as customer cancelled the payment.',
                '99' => 'Failure - Payment for the given transaction failed.',
                '93' => 'InvalidOtp - Payment failed due to invalid One-time password (OTP) entered by the customer.',
                '94' => 'ExceedDailyLimit - Payment failed due to exceeded daily limit by the customer.',
                '95' => 'ExceedMonthlyLimit - Payment failed due to exceeded Monthly limit by the customer.',
                '96' => 'UserBlocked - Payment failed due to customer has been suspended.',
                '97' => 'InvalidAccount - Payment failed due to Invalid customer payment account.',
                '98' => 'InsufficientFund - Payment failed due to insufficient fund on the customer payment account.',
            ];
            $paymentStatus = isset($data['paymentStatusCode']) ? $paymentStatusCodes[$data['paymentStatusCode']] ?? 'Unknown Status' : 'Not Provided';
        @endphp

        @if(isset($data['paymentStatusCode']))
            <h2>Payment Status: {{ $paymentStatus }}</h2>
        @endif

        <p>Data received from Razer Gold:</p>
        <pre>{{ json_encode($data, JSON_PRETTY_PRINT) }}</pre>
        <p>You can now close this window or return to the payment tester.</p>
        <a href="/payment-tester">Return to Payment Tester</a>
    </div>
</body>
</html>