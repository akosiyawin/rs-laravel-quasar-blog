<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the test user or create one if it doesn't exist
        $user = User::find(1);
        
        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }
        
        // Create 10 sample blog posts
        Blog::factory()
            ->count(10)
            ->create([
                'created_by' => $user->id,
            ]);
            
        // Create 5 more blog posts with random users
        Blog::factory()
            ->count(5)
            ->create();
    }
} 