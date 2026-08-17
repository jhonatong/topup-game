<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\MockGameProviderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentSimulatorController extends Controller
{
    protected MockGameProviderService $providerService;

    public function __construct(MockGameProviderService $providerService)
    {
        $this->providerService = $providerService;
    }

    /**
     * POST /api/simulator/pay
     * Instantly simulate paying an invoice for quick testing from frontend or API tools.
     */
    public function simulatePayment(Request $request): JsonResponse
    {
        $request->validate([
            'invoice_number' => 'required|string|exists:transactions,invoice_number',
        ]);

        $transaction = Transaction::where('invoice_number', $request->input('invoice_number'))->firstOrFail();

        $transaction->update([
            'payment_status' => 'paid',
            'fulfillment_status' => 'processing',
        ]);

        // Trigger item delivery
        $this->providerService->deliverProduct($transaction);

        return response()->json([
            'success' => true,
            'message' => 'Simulasi pembayaran LUNAS berhasil! Produk otomatis terkirim.',
            'data' => $transaction->fresh(['product.category']),
        ]);
    }
}
