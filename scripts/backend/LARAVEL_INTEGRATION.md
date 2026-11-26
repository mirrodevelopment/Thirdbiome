# Laravel Backend Integration Guide (Instant Auto-Mail & Full CRUD)

## 1. Apply Database Migration
Run `scripts/database/cod_migration.sql` followed by `scripts/database/cod_email_notification_migration.sql` on MySQL database `u788130396_biome`.

## 2. Configure SMTP & Recipient in `.env`
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_USERNAME=notifications@thirdbiome.com
MAIL_PASSWORD="your-smtp-password"
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="notifications@thirdbiome.com"
MAIL_FROM_NAME="Third Biome"
COD_NOTIFICATION_RECIPIENT="Info@aeobiome.com"
```

## 3. Install Mailable & Email View
- Copy `CodOrderNotification.php` -> `app/Mail/CodOrderNotification.php`
- Copy `cod-order-notification.blade.php` -> `resources/views/emails/cod-order-notification.blade.php`

## 4. Instant Automatic Dispatch (No Approval / No Queue Worker Needed)
Inside `OrderController@store` right after saving the order to MySQL:
```php
if (($order->paymentMethod === 'cod' || $order->isCod) && !$order->cod_notification_sent) {
    $recipient = env('COD_NOTIFICATION_RECIPIENT', 'Info@aeobiome.com');
    try {
        // Sends immediately on COD order creation without manual approval
        \Mail::to($recipient)->send(new \App\Mail\CodOrderNotification($order));

        $order->update([
            'cod_notification_sent' => true,
            'cod_notification_sent_at' => now(),
        ]);

        \DB::table('order_notification_logs')->insert([
            'order_id' => $order->id,
            'order_number' => $order->orderNumber ?? $order->order_number,
            'recipient' => $recipient,
            'notification_type' => 'cod_auto',
            'status' => 'sent',
            'attempts' => 1,
            'sent_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    } catch (\Throwable $e) {
        \Log::error('COD email failed for order #' . ($order->orderNumber ?? $order->id) . ': ' . $e->getMessage());
        \DB::table('order_notification_logs')->insert([
            'order_id' => $order->id,
            'order_number' => $order->orderNumber ?? $order->order_number,
            'recipient' => $recipient,
            'notification_type' => 'cod_auto',
            'status' => 'failed',
            'attempts' => 1,
            'error_message' => $e->getMessage(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
```

## 5. Admin Panel CRUD API Routes (`routes/api.php`)
```php
// Orders CRUD
Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::put('/orders/{id}', [OrderController::class, 'update']);
Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
Route::post('/orders/{id}/resend-cod-email', [OrderController::class, 'resendCodEmail']);

// COD Email Notification Logs CRUD
Route::get('/cod-notifications', [CodNotificationController::class, 'index']);
Route::post('/cod-notifications', [CodNotificationController::class, 'store']);
Route::put('/cod-notifications/{id}', [CodNotificationController::class, 'update']);
Route::delete('/cod-notifications/{id}', [CodNotificationController::class, 'destroy']);
```
