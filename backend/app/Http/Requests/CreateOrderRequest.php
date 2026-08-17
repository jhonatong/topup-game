<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'user_game_id' => 'required|string|min:4|max:50',
            'zone_game_id' => 'nullable|string|max:50',
            'game_nickname' => 'required|string|max:100',
            'payment_method' => 'required|string|in:qris,gopay,dana,shopeepay,bca_va,mandiri_va,bri_va',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Produk nominal wajib dipilih.',
            'product_id.exists' => 'Produk tidak ditemukan.',
            'user_game_id.required' => 'User ID game wajib diisi.',
            'game_nickname.required' => 'Nickname game wajib diisi / diverifikasi.',
            'payment_method.required' => 'Metode pembayaran wajib dipilih.',
        ];
    }
}
