<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'product_id',
        'user_game_id',
        'zone_game_id',
        'game_nickname',
        'amount',
        'payment_method',
        'payment_status',
        'fulfillment_status',
        'payment_reference',
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
