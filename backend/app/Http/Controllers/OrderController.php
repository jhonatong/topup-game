<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckIdRequest;
use App\Http\Requests\CreateOrderRequest;
use App\Models\Product;
use App\Models\Transaction;
use App\Services\MockGameProviderService;
use App\Services\MockPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    protected MockGameProviderService $providerService;
    protected MockPaymentService $paymentService;

    public function __construct(
        MockGameProviderService $providerService,
        MockPaymentService $paymentService
    ) {
        $this->providerService = $providerService;
        $this->paymentService = $paymentService;
    }

    /**
     * POST /api/check-id
     * Check User ID / Server ID and return simulated nickname.
     */
    public function checkId(CheckIdRequest $request): JsonResponse
    {
        $result = $this->providerService->checkUserGameId(
            $request->input('category_id'),
            $request->input('user_game_id'),
            $request->input('zone_game_id')
        );

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 422);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'nickname' => $result['nickname'],
                'user_game_id' => $result['user_game_id'],
                'zone_game_id' => $result['zone_game_id'],
            ],
        ]);
    }

    /**
     * POST /api/orders
     * Create a new transaction order and generate payment mock details.
     */
    public function store(CreateOrderRequest $request): JsonResponse
    {
        $product = Product::with('category')->findOrFail($request->input('product_id'));

        $invoiceNumber = 'INV-' . date('Ymd') . '-' . strtoupper(Str::random(6));

        $transaction = Transaction::create([
            'invoice_number' => $invoiceNumber,
            'product_id' => $product->id,
            'user_game_id' => $request->input('user_game_id'),
            'zone_game_id' => $request->input('zone_game_id'),
            'game_nickname' => $request->input('game_nickname'),
            'amount' => $product->price,
            'payment_method' => $request->input('payment_method'),
            'payment_status' => 'pending',
            'fulfillment_status' => 'pending',
        ]);

        $paymentDetails = $this->paymentService->createPaymentPayload($transaction);
        $transaction->update([
            'payment_reference' => $paymentDetails['reference'],
        ]);

        $transaction->load(['product.category']);

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibuat.',
            'data' => [
                'transaction' => $transaction,
                'payment_details' => $paymentDetails,
            ],
        ], 201);
    }

    /**
     * GET /api/orders/{invoice_number}
     * Get transaction invoice & status details.
     */
    public function show(string $invoiceNumber): JsonResponse
    {
        $transaction = Transaction::where('invoice_number', $invoiceNumber)
            ->with(['product.category'])
            ->first();

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice transaksi tidak ditemukan.',
            ], 404);
        }

        $paymentDetails = $this->paymentService->createPaymentPayload($transaction);

        return response()->json([
            'success' => true,
            'data' => [
                'transaction' => $transaction,
                'payment_details' => $paymentDetails,
            ],
        ]);
    }
}
