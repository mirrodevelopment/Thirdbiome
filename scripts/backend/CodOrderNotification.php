<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Mailable for immediate, zero-approval internal Cash on Delivery (COD) notifications.
 * Place at: app/Mail/CodOrderNotification.php
 */
class CodOrderNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Order $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function envelope(): Envelope
    {
        $orderNo = $this->order->orderNumber ?? $this->order->order_number ?? $this->order->id;
        return new Envelope(
            subject: "New COD Order Received – Third Biome (#{$orderNo})",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.cod-order-notification',
            with: [
                'order' => $this->order,
            ],
        );
    }
}
