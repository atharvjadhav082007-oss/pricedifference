const nodemailer = require('nodemailer');

/**
 * Send a price-drop alert email.
 * Falls back to console.log if EMAIL_USER / EMAIL_PASS are not configured.
 */
async function sendAlertEmail(email, product, priceEntry) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
      process.env.EMAIL_USER === 'your@gmail.com') {
    console.log(`[Emailer stub] Would send alert to ${email}:`);
    console.log(`  Product: ${product.name}`);
    console.log(`  Platform: ${priceEntry.platform} — ₹${priceEntry.offerPrice}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mrpFmt = priceEntry.mrp.toLocaleString('en-IN');
  const priceFmt = priceEntry.offerPrice.toLocaleString('en-IN');
  const savingFmt = priceEntry.saving.toLocaleString('en-IN');

  await transporter.sendMail({
    from: `"PriceRadar 🔴" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Price drop alert: ${product.name} is now ₹${priceFmt}`,
    html: `
      <div style="background:#0f1117;color:#e8e8e8;padding:24px;font-family:Inter,sans-serif;border-radius:12px;max-width:560px;margin:auto">
        <h2 style="color:#f97316;margin-top:0">🔴 PriceRadar — Price Drop Alert</h2>
        <p style="color:#ccc">${product.name} has dropped to your target price on
          <strong style="color:#fff">${priceEntry.platform}</strong>.</p>
        <div style="background:#161b27;border-radius:8px;padding:16px;margin:16px 0;border:1px solid #2a2f3e">
          <p style="margin:4px 0;color:#888">MRP: <s>₹${mrpFmt}</s></p>
          <p style="margin:8px 0;color:#22c55e;font-size:20px;font-weight:600">Now: ₹${priceFmt}</p>
          <p style="margin:4px 0;color:#f97316">You save ₹${savingFmt} (${priceEntry.discount}% off)</p>
        </div>
        <a href="${priceEntry.url}" style="display:inline-block;background:#f97316;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:8px">Buy Now →</a>
        <p style="color:#555;font-size:11px;margin-top:24px">You received this because you set a price alert on PriceRadar.</p>
      </div>
    `,
  });

  console.log(`[Emailer] Alert sent to ${email} for ${product.name}`);
}

module.exports = { sendAlertEmail };
