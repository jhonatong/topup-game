<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Mobile Legends: Bang Bang',
                'slug' => 'mobile-legends',
                'thumbnail' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
                'has_zone_id' => true,
                'is_active' => true,
                'products' => [
                    ['sku_code' => 'ML-86', 'name' => '86 Diamonds', 'price' => 20000],
                    ['sku_code' => 'ML-172', 'name' => '172 Diamonds', 'price' => 40000],
                    ['sku_code' => 'ML-257', 'name' => '257 Diamonds (Popular)', 'price' => 60000],
                    ['sku_code' => 'ML-706', 'name' => '706 Diamonds (Best Value)', 'price' => 165000],
                    ['sku_code' => 'ML-2195', 'name' => '2195 Diamonds', 'price' => 500000],
                    ['sku_code' => 'ML-PASS', 'name' => 'Weekly Diamond Pass', 'price' => 28000],
                ]
            ],
            [
                'name' => 'Free Fire',
                'slug' => 'free-fire',
                'thumbnail' => 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
                'has_zone_id' => false,
                'is_active' => true,
                'products' => [
                    ['sku_code' => 'FF-70', 'name' => '70 Diamonds', 'price' => 10000],
                    ['sku_code' => 'FF-140', 'name' => '140 Diamonds', 'price' => 20000],
                    ['sku_code' => 'FF-355', 'name' => '355 Diamonds', 'price' => 50000],
                    ['sku_code' => 'FF-720', 'name' => '720 Diamonds', 'price' => 100000],
                    ['sku_code' => 'FF-2000', 'name' => '2000 Diamonds', 'price' => 275000],
                ]
            ],
            [
                'name' => 'Valorant',
                'slug' => 'valorant',
                'thumbnail' => 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop',
                'has_zone_id' => false,
                'is_active' => true,
                'products' => [
                    ['sku_code' => 'VAL-475', 'name' => '475 VP', 'price' => 55000],
                    ['sku_code' => 'VAL-1000', 'name' => '1000 VP', 'price' => 110000],
                    ['sku_code' => 'VAL-2050', 'name' => '2050 VP', 'price' => 220000],
                    ['sku_code' => 'VAL-3650', 'name' => '3650 VP', 'price' => 380000],
                    ['sku_code' => 'VAL-5350', 'name' => '5350 VP', 'price' => 550000],
                ]
            ],
            [
                'name' => 'Genshin Impact',
                'slug' => 'genshin-impact',
                'thumbnail' => 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=800&auto=format&fit=crop',
                'has_zone_id' => true,
                'is_active' => true,
                'products' => [
                    ['sku_code' => 'GI-WELKIN', 'name' => 'Blessing of the Welkin Moon', 'price' => 79000],
                    ['sku_code' => 'GI-60', 'name' => '60 Genesis Crystals', 'price' => 16000],
                    ['sku_code' => 'GI-300', 'name' => '300+30 Genesis Crystals', 'price' => 79000],
                    ['sku_code' => 'GI-980', 'name' => '980+110 Genesis Crystals', 'price' => 245000],
                    ['sku_code' => 'GI-1980', 'name' => '1980+260 Genesis Crystals', 'price' => 479000],
                ]
            ],
            [
                'name' => 'PUBG Mobile',
                'slug' => 'pubg-mobile',
                'thumbnail' => 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=800&auto=format&fit=crop',
                'has_zone_id' => false,
                'is_active' => true,
                'products' => [
                    ['sku_code' => 'PUBG-60', 'name' => '60 UC', 'price' => 14000],
                    ['sku_code' => 'PUBG-325', 'name' => '325 UC', 'price' => 70000],
                    ['sku_code' => 'PUBG-660', 'name' => '660 UC', 'price' => 140000],
                    ['sku_code' => 'PUBG-1800', 'name' => '1800 UC', 'price' => 350000],
                ]
            ],
            [
                'name' => 'Honkai: Star Rail',
                'slug' => 'honkai-star-rail',
                'thumbnail' => 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
                'has_zone_id' => true,
                'is_active' => true,
                'products' => [
                    ['sku_code' => 'HSR-EXPRESS', 'name' => 'Express Supply Pass', 'price' => 79000],
                    ['sku_code' => 'HSR-60', 'name' => '60 Oneiric Shard', 'price' => 16000],
                    ['sku_code' => 'HSR-300', 'name' => '300+30 Oneiric Shard', 'price' => 79000],
                    ['sku_code' => 'HSR-980', 'name' => '980+110 Oneiric Shard', 'price' => 245000],
                ]
            ],
            [
                'name' => 'Roblox',
                'slug' => 'roblox',
                'thumbnail' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
                'has_zone_id' => false,
                'is_active' => true,
                'products' => [
                    ['sku_code' => 'RBLX-400', 'name' => '400 Robux', 'price' => 65000],
                    ['sku_code' => 'RBLX-800', 'name' => '800 Robux', 'price' => 130000],
                    ['sku_code' => 'RBLX-2000', 'name' => '2000 Robux', 'price' => 325000],
                ]
            ],
            [
                'name' => 'Black Myth: Wukong',
                'slug' => 'black-myth-wukong',
                'thumbnail' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
                'has_zone_id' => false,
                'is_active' => true,
                'products' => [
                    ['sku_code' => 'BMW-STANDARD', 'name' => 'Standard Edition Activation', 'price' => 699000],
                    ['sku_code' => 'BMW-DELUXE', 'name' => 'Deluxe Edition Activation', 'price' => 859000],
                ]
            ],
        ];

        foreach ($categories as $catData) {
            $products = $catData['products'];
            unset($catData['products']);

            $category = Category::create($catData);

            foreach ($products as $prodData) {
                $category->products()->create([
                    'sku_code' => $prodData['sku_code'],
                    'name' => $prodData['name'],
                    'price' => $prodData['price'],
                    'is_active' => true,
                ]);
            }
        }
    }
}
