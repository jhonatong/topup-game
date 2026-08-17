<?php

namespace App\Services;

use App\Models\Transaction;

class MockPaymentService
{
    /**
     * Generate simulated payment payload (QRIS payload / Virtual Account details).
     */
    public function createPaymentPayload(Transaction $transaction): array
    {
        $reference = 'PAY-' . strtoupper(bin2hex(random_bytes(4)));
        $paymentMethod = strtoupper($transaction->payment_method);
        
        $payload = [
            'reference' => $reference,
            'payment_method' => $paymentMethod,
            'amount' => $transaction->amount,
            'expired_at' => now()->addHours(2)->toIso8601String(),
        ];

        if (in_array($paymentMethod, ['QRIS', 'GOPAY', 'DANA', 'SHOPEEPAY'])) {
            $payload['qr_code_url'] = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021226670016COM.GO-JEK.WWW0118936009143000000001021520042456488730336053033605802ID5910TOPUPZONE6007JAKARTA61051234062070703A0163041234';
            $payload['instructions'] = 'Buka aplikasi e-wallet Anda (GoPay/ShopeePay/Dana/OVO) dan scan QRIS di atas untuk melakukan pembayaran.';
        } else {
            $payload['virtual_account'] = '88012' . rand(100000000, 999999999);
            $payload['instructions'] = 'Transfer tepat sesuai nominal ke Nomor Virtual Account ' . $paymentMethod . ' di atas melalui ATM / m-Banking.';
        }

        return $payload;
    }
}
