<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminTransactionController extends Controller
{
    /**
     * GET /api/admin/transactions
     * List all customer transactions with optional filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Transaction::with(['product.category'])->latest();

        if ($request->has('payment_status') && !empty($request->query('payment_status'))) {
            $query->where('payment_status', $request->query('payment_status'));
        }

        if ($request->has('search') && !empty($request->query('search'))) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhere('user_game_id', 'like', "%{$search}%")
                  ->orWhere('game_nickname', 'like', "%{$search}%");
            });
        }

        $transactions = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $transactions,
        ]);
    }
}
