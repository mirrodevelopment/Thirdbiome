-- ==============================================================================
-- Third Biome: Cash on Delivery (COD) Database Migration & Schema Specification
-- Covers:
-- 1. MySQL (Production Laravel Backend at admin.thirdbiome.com)
-- 2. PostgreSQL / Supabase (Publications & Direct Storage)
-- ==============================================================================

-- ==============================================================================
-- SECTION 1: MySQL (Laravel Backend)
-- Database: u788130396_biome / orders table
-- ==============================================================================

-- Check and update orders table for COD support
-- Ensure payment_method accepts 'cod'
ALTER TABLE `orders` 
    MODIFY COLUMN `payment_method` VARCHAR(50) NOT NULL DEFAULT 'payu';

-- Add is_cod flag if not already present
ALTER TABLE `orders` 
    ADD COLUMN IF NOT EXISTS `is_cod` TINYINT(1) NOT NULL DEFAULT 0 
    AFTER `payment_method`;

-- Add cod_fee if applicable
ALTER TABLE `orders` 
    ADD COLUMN IF NOT EXISTS `cod_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 
    AFTER `is_cod`;

-- Add cod_status to track physical cash collection during delivery
ALTER TABLE `orders` 
    ADD COLUMN IF NOT EXISTS `cod_status` ENUM('not_applicable', 'pending_collection', 'collected', 'remitted_to_bank', 'cancelled') 
    NOT NULL DEFAULT 'not_applicable' 
    AFTER `cod_fee`;

-- Add index on payment_method for reporting and admin filtering
ALTER TABLE `orders` 
    ADD INDEX IF NOT EXISTS `idx_orders_payment_method` (`payment_method`);

-- Optional: Create settings table in MySQL if checkout control is managed via backend API
CREATE TABLE IF NOT EXISTS `store_settings` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(100) NOT NULL UNIQUE,
    `value` JSON NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default checkout settings
INSERT INTO `store_settings` (`key`, `value`) 
VALUES (
    'checkout_controls', 
    JSON_OBJECT(
        'isCodEnabled', true,
        'codFee', 0,
        'minOrderAmount', 0,
        'maxOrderAmount', 50000,
        'codNotice', 'Pay with cash or UPI at your doorstep upon delivery.',
        'updatedAt', CURRENT_TIMESTAMP
    )
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);


-- ==============================================================================
-- SECTION 2: Laravel Migration Class (for Laravel Developers)
-- File: database/migrations/2026_02_24_000001_add_cod_to_orders_table.php
-- ==============================================================================
/*
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'is_cod')) {
                $table->boolean('is_cod')->default(false)->after('payment_method');
            }
            if (!Schema::hasColumn('orders', 'cod_fee')) {
                $table->decimal('cod_fee', 10, 2)->default(0.00)->after('is_cod');
            }
            if (!Schema::hasColumn('orders', 'cod_status')) {
                $table->enum('cod_status', ['not_applicable', 'pending_collection', 'collected', 'remitted_to_bank', 'cancelled'])
                    ->default('not_applicable')
                    ->after('cod_fee');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['is_cod', 'cod_fee', 'cod_status']);
        });
    }
};
*/


-- ==============================================================================
-- SECTION 3: PostgreSQL / Supabase Schema
-- ==============================================================================

-- If managing orders directly in Supabase
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    total_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    coupon_code VARCHAR(100),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'payu', -- 'payu' or 'cod'
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed'
    is_cod BOOLEAN NOT NULL DEFAULT FALSE,
    cod_fee NUMERIC(10, 2) DEFAULT 0.00,
    cod_status VARCHAR(50) DEFAULT 'not_applicable',
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checkout & Store Settings Table in Supabase
CREATE TABLE IF NOT EXISTS public.checkout_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    is_cod_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    cod_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    max_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 50000.00,
    cod_notice TEXT DEFAULT 'Pay with cash or UPI at your doorstep upon delivery.',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by VARCHAR(255)
);

-- Insert default checkout controls
INSERT INTO public.checkout_settings (id, is_cod_enabled, cod_fee, min_order_amount, max_order_amount, cod_notice)
VALUES ('default', TRUE, 0.00, 0.00, 50000.00, 'Pay with cash or UPI at your doorstep upon delivery.')
ON CONFLICT (id) DO UPDATE SET
    is_cod_enabled = EXCLUDED.is_cod_enabled,
    cod_fee = EXCLUDED.cod_fee,
    min_order_amount = EXCLUDED.min_order_amount,
    max_order_amount = EXCLUDED.max_order_amount,
    cod_notice = EXCLUDED.cod_notice,
    updated_at = NOW();

-- Enable RLS for security
ALTER TABLE public.checkout_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to checkout settings so frontend can check COD availability
CREATE POLICY "Public can view checkout settings" 
ON public.checkout_settings FOR SELECT USING (true);

-- Allow authenticated admins to update checkout settings
CREATE POLICY "Admins can update checkout settings" 
ON public.checkout_settings FOR UPDATE USING (auth.role() = 'authenticated');
