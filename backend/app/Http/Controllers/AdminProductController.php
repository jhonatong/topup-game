<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    /**
     * POST /api/admin/products
     * Create a new nominal product for a game.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sku_code' => 'required|string|unique:products,sku_code',
            'name' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $product = Product::create([
            'category_id' => $validated['category_id'],
            'sku_code' => $validated['sku_code'],
            'name' => $validated['name'],
            'price' => $validated['price'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produk nominal baru berhasil ditambahkan.',
            'data' => $product->load('category'),
        ], 201);
    }

    /**
     * PUT /api/admin/products/{id}
     * Update product details & price.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'sku_code' => 'sometimes|required|string|unique:products,sku_code,' . $id,
            'name' => 'sometimes|required|string|max:100',
            'price' => 'sometimes|required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Harga & data produk berhasil diperbarui.',
            'data' => $product->load('category'),
        ]);
    }

    /**
     * DELETE /api/admin/products/{id}
     * Delete a nominal product.
     */
    public function destroy(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk nominal berhasil dihapus.',
        ]);
    }
}
