<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Models\AdSpend;
use App\Models\Campaign;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DemoDataSeeder extends Seeder
{
    /**
     * Realistic-looking demo data so the dashboard isn't empty on first login.
     */
    public function run(): void
    {
        $campaigns = collect([
            ['name' => 'Summer Offer', 'platform' => 'facebook', 'daily_spend' => [80, 220]],
            ['name' => 'Product Video', 'platform' => 'facebook', 'daily_spend' => [50, 160]],
            ['name' => 'Retargeting', 'platform' => 'facebook', 'daily_spend' => [30, 100]],
        ])->map(fn ($c) => Campaign::create([
            'name' => $c['name'],
            'platform' => $c['platform'],
            'is_active' => true,
        ])->setAttribute('daily_spend_range', $c['daily_spend']));

        $products = [
            ['name' => 'Glow Serum', 'price' => 999],
            ['name' => 'Wireless Earbuds Pro', 'price' => 1499],
            ['name' => 'Smart Fitness Band', 'price' => 1899],
        ];

        $names = ['Rahim', 'Karim', 'Hasan', 'Jasim', 'Nadia', 'Farhana', 'Sumon', 'Tania', 'Mizan', 'Aklima', 'Shakil', 'Rupa'];

        $start = Carbon::now()->startOfMonth();
        $end = Carbon::now();

        // Ad spend per campaign per day of the month so far.
        foreach ($campaigns as $campaign) {
            [$min, $max] = $campaign->getAttribute('daily_spend_range');
            for ($day = $start->copy(); $day->lte($end); $day->addDay()) {
                AdSpend::create([
                    'campaign_id' => $campaign->id,
                    'date' => $day->toDateString(),
                    'amount' => fake()->numberBetween($min, $max),
                ]);
            }
        }

        // Orders spread across the month. Older orders are further along the pipeline.
        $orderCount = fake()->numberBetween(70, 90);

        for ($i = 0; $i < $orderCount; $i++) {
            $createdAt = Carbon::createFromTimestamp(
                fake()->numberBetween($start->timestamp, $end->timestamp)
            );

            $ageInDays = $createdAt->diffInDays($end);
            $status = $this->statusForAge($ageInDays);

            $customer = Customer::create([
                'name' => fake()->randomElement($names),
                'phone' => '01'.fake()->numerify('#########'),
                'address' => fake()->streetAddress().', Dhaka',
            ]);

            $product = fake()->randomElement($products);
            $quantity = fake()->randomElement([1, 1, 1, 2]);

            // ~85% of orders are attributed to a campaign, rest organic/direct.
            $campaign = fake()->boolean(85) ? $campaigns->random() : null;

            $order = Order::create([
                'customer_id' => $customer->id,
                'product_name' => $product['name'],
                'quantity' => $quantity,
                'unit_price' => $product['price'],
                'status' => $status,
                'campaign_id' => $campaign?->id,
                'ad_identifier' => $campaign ? 'ad_'.fake()->numerify('######') : null,
                'utm_source' => $campaign ? 'facebook' : null,
                'utm_medium' => $campaign ? 'cpc' : null,
                'utm_campaign' => $campaign?->name,
                'utm_content' => $campaign ? fake()->word() : null,
                'fbclid' => $campaign ? fake()->uuid() : null,
                'fbp' => $campaign ? 'fb.1.'.$createdAt->timestamp.'.'.fake()->numerify('##########') : null,
                'ip_address' => fake()->ipv4(),
                'user_agent' => 'Mozilla/5.0 (demo seed)',
            ]);

            $order->forceFill(['created_at' => $createdAt, 'updated_at' => $createdAt])->saveQuietly();
            $order->statusHistories()->update(['changed_at' => $createdAt, 'created_at' => $createdAt, 'updated_at' => $createdAt]);
        }
    }

    private function statusForAge(int $ageInDays): OrderStatus
    {
        // Newer orders skew toward the front of the pipeline; older ones toward the end.
        return match (true) {
            $ageInDays < 1 => fake()->randomElement([OrderStatus::New, OrderStatus::New, OrderStatus::Called]),
            $ageInDays < 3 => fake()->randomElement([OrderStatus::Called, OrderStatus::Confirmed, OrderStatus::New]),
            $ageInDays < 7 => fake()->randomElement([OrderStatus::Confirmed, OrderStatus::Shipped, OrderStatus::Confirmed]),
            default => fake()->randomElement([
                OrderStatus::Delivered, OrderStatus::Delivered, OrderStatus::Delivered,
                OrderStatus::Shipped, OrderStatus::Cancelled,
            ]),
        };
    }
}
