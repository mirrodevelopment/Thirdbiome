{{-- Place at: resources/views/emails/cod-order-notification.blade.php --}}
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New COD Order Received – Third Biome</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #1e293b; padding: 20px; margin: 0; }
    .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .head { background: #0f172a; padding: 24px; text-align: center; color: #ffffff; }
    .head h1 { margin: 0; font-size: 20px; letter-spacing: 0.08em; font-weight: 800; text-transform: uppercase; }
    .badge { display: inline-block; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; margin-top: 10px; }
    .content { padding: 24px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px; }
    th, td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; text-align: left; vertical-align: top; }
    th { color: #64748b; font-weight: 600; width: 36%; }
    td { font-weight: 500; color: #0f172a; }
    .total-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 18px; margin-top: 22px; text-align: center; }
    .total-lbl { font-size: 12px; color: #166534; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .total-amt { font-size: 28px; color: #14532d; font-weight: 800; margin-top: 4px; }
    .footer { text-align: center; font-size: 12px; color: #94a3b8; padding: 16px 24px; background: #f8fafc; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  @php
    $orderNo = $order->orderNumber ?? $order->order_number ?? $order->id;
    $customerName = $order->customerName ?? $order->customer_name ?? 'Customer';
    $customerPhone = $order->customerPhone ?? $order->customer_phone ?? 'N/A';
    $customerEmail = $order->customerEmail ?? $order->customer_email ?? 'N/A';
    $codFee = (float) ($order->codFee ?? $order->cod_fee ?? 0);
    $totalAmount = (float) ($order->totalAmount ?? $order->total_amount ?? 0);
    $productAmount = max(0, $totalAmount - $codFee);
    $items = is_string($order->items) ? json_decode($order->items, true) : ($order->items ?? []);
    $addr = is_string($order->shippingAddress ?? $order->shipping_address)
        ? json_decode($order->shippingAddress ?? $order->shipping_address, true)
        : ($order->shippingAddress ?? $order->shipping_address ?? []);
    $addrLine = is_array($addr)
        ? implode(', ', array_filter([
            $addr['street'] ?? '',
            $addr['city'] ?? '',
            $addr['state'] ?? '',
            $addr['zipCode'] ?? '',
            $addr['country'] ?? '',
          ]))
        : (string) $addr;
  @endphp

  <div class="card">
    <div class="head">
      <h1>THIRD BIOME</h1>
      <div class="badge">New Cash on Delivery Order</div>
    </div>
    <div class="content">
      <p style="margin: 0 0 16px; font-size: 15px; font-weight: 600;">
        A customer has successfully placed a Cash on Delivery order.
      </p>

      <table>
        <tr><th>Order ID</th><td><strong>#{{ $orderNo }}</strong></td></tr>
        <tr><th>Order Date</th><td>{{ now()->timezone('Asia/Kolkata')->format('d M Y, h:i A') }}</td></tr>
        <tr><th>Customer Name</th><td>{{ $customerName }}</td></tr>
        <tr><th>Phone</th><td><a href="tel:{{ $customerPhone }}">{{ $customerPhone }}</a></td></tr>
        <tr><th>Email</th><td><a href="mailto:{{ $customerEmail }}">{{ $customerEmail }}</a></td></tr>
        <tr>
          <th>Products</th>
          <td>
            @if(is_array($items) && count($items) > 0)
              @foreach($items as $item)
                <div>{{ $item['name'] ?? 'Product' }} × {{ $item['quantity'] ?? 1 }}</div>
              @endforeach
            @else
              Biome Balance
            @endif
          </td>
        </tr>
        <tr><th>Product Amount</th><td>₹{{ number_format($productAmount, 2) }}</td></tr>
        <tr><th>COD Charges</th><td>₹{{ number_format($codFee, 2) }}</td></tr>
        <tr><th>Payment Method</th><td>Cash on Delivery (COD)</td></tr>
        <tr><th>Payment Status</th><td><span style="color: #d97706; font-weight: 700;">Pending</span></td></tr>
        <tr><th>Delivery Address</th><td>{{ $addrLine ?: 'N/A' }}</td></tr>
      </table>

      <div class="total-box">
        <div class="total-lbl">Amount to Collect</div>
        <div class="total-amt">₹{{ number_format($totalAmount, 2) }}</div>
      </div>
    </div>
    <div class="footer">
      This is an automatically generated internal order notification from Third Biome.
    </div>
  </div>
</body>
</html>
