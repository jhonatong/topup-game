<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckIdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'user_game_id' => 'required|string|min:4|max:50',
            'zone_game_id' => 'nullable|string|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategori game wajib dipilih.',
            'category_id.exists' => 'Kategori game tidak ditemukan.',
            'user_game_id.required' => 'User ID game wajib diisi.',
            'user_game_id.min' => 'User ID game minimal 4 karakter.',
        ];
    }
}
