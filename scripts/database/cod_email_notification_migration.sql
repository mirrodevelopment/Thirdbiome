-- ==============================================================================
-- Third Biome: COD Internal Email Notification & Audit Log Migration
-- Target: MySQL (u788130396_biome) & PostgreSQL (Supabase)
-- ==============================================================================

-- 1. MySQL: Track COD email notification status on orders
ALTER TABLE `orders`
    ADD COLUMN IF NOT EXISTS `cod_notification_sent` TINYINT(1) NOT NULL DEFAULT 0 AFTER `cod_status`,
    ADD COLUMN IF NOT EXISTS `cod_notification_sent_at` TIMESTAMP NULL DEFAULT NULL AFTER `cod_notification_sent`;

-- 2. MySQL: Notification delivery & retry audit logs
CREATE TABLE IF NOT EXISTS `order_notification_logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `order_id` BIGINT UNSIGNED NOT NULL,
    `order_number` VARCHAR(100) NOT NULL,
    `recipient` VARCHAR(255) NOT NULL DEFAULT 'Info@aeobiome.com',
    `notification_type` VARCHAR(50) NOT NULL DEFAULT 'cod_alert',
    `status` ENUM('queued', 'sent', 'failed') NOT NULL DEFAULT 'queued',
    `attempts` INT UNSIGNED NOT NULL DEFAULT 1,
    `error_message` TEXT NULL,
    `sent_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_notif_order_id` (`order_id`),
    INDEX `idx_notif_order_number` (`order_number`),
    INDEX `idx_notif_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PostgreSQL / Supabase: Extend checkout_settings for email controls
ALTER TABLE IF EXISTS public.checkout_settings
    ADD COLUMN IF NOT EXISTS enable_cod_email_notification BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS cod_notification_recipient VARCHAR(255) DEFAULT 'Info@aeobiome.com';

ALTER TABLE IF EXISTS public.orders
    ADD COLUMN IF NOT EXISTS cod_notification_sent BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS cod_notification_sent_at TIMESTAMPTZ;
