<?php

namespace App\Services;

use App\Models\Transaction;

class MockGameProviderService
{
    /**
     * Validate Game User ID and Zone ID (Server), return simulated Nickname.
     */
    public function checkUserGameId(int $categoryId, string $userId, ?string $zoneId = null): array
    {
        // Simple validation rule: User ID must be at least 4 digits
        if (strlen(trim($userId)) < 4) {
            return [
                'success' => false,
                'message' => 'User ID tidak valid (minimal 4 Karakter).',
                'nickname' => null,
            ];
        }

        // Generate deterministic mock nicknames based on User ID
        $mockPrefixes = ['ProGamer', 'Shadow', 'VipPlayer', 'CyberKnight', 'ApexLegend', 'MythicHero'];
        $hash = crc32($userId . ($zoneId ?? ''));
        $prefix = $mockPrefixes[abs($hash) % count($mockPrefixes)];
        $nickname = $prefix . '_' . substr($userId, -3);

        return [
            'success' => true,
            'message' => 'User ID ditemukan',
            'nickname' => $nickname,
            'user_game_id' => $userId,
            'zone_game_id' => $zoneId,
        ];
    }

    /**
     * Simulate automated delivery of diamonds / game items after successful payment.
     */
    public function deliverProduct(Transaction $transaction): bool
    {
        // Mark fulfillment status as processing then success
        $transaction->update([
            'fulfillment_status' => 'success',
        ]);

        return true;
    }
}
