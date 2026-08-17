<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\MockGameProviderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentCallbackController extends Controller
{
    protected MockGameProviderService $providerService;

    public function __construct(MockGameProviderService $providerService)
    {
        $this->providerService = $providerService;
    }

    /**
     * POST /api/webhook/payment
     * Receive payment gateway callback notification.
     */
    public function webhook(Request $request): JsonResponse
    {
        $invoiceNumber = $request->input('invoice_number');
        $status = $request->input('status', 'paid');

        $transaction = Transaction::where('invoice_number', $invoiceNumber)->first();

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan.',
            ], 404);
        }

        if ($status === 'paid' && $transaction->payment_status !== 'paid') {
            $transaction->update([
                'payment_status' => 'paid',
                'fulfillment_status' => 'processing',
            ]);

            // Trigger automated item fulfillment via provider service
            $this->providerService->deliverProduct($transaction);
        } elseif ($status === 'failed') {
            $transaction->update([
                'payment_status' => 'failed',
                'fulfillment_status' => 'failed',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Callback webhook berhasil diproses.',
            'data' => $transaction->fresh(['product.category']),
        ]);
    }
}
