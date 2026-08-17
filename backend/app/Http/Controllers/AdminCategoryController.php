<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    /**
     * POST /api/admin/categories
     * Create a new game category.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'nullable|string|max:100|unique:categories,slug',
            'thumbnail' => 'required|string|url',
            'has_zone_id' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'thumbnail' => $validated['thumbnail'],
            'has_zone_id' => $validated['has_zone_id'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Game baru berhasil ditambahkan ke katalog.',
            'data' => $category,
        ], 201);
    }

    /**
     * PUT /api/admin/categories/{id}
     * Update game category details & thumbnail URL.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'slug' => 'sometimes|required|string|max:100|unique:categories,slug,' . $id,
            'thumbnail' => 'sometimes|required|string|url',
            'has_zone_id' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data game berhasil diperbarui.',
            'data' => $category,
        ]);
    }

    /**
     * DELETE /api/admin/categories/{id}
     * Delete a game category.
     */
    public function destroy(int $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Game berhasil dihapus dari katalog.',
        ]);
    }
}
