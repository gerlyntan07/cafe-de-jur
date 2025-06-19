// routes/stripe.js
const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
require('dotenv').config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    // Build line items with per-unit pricing and qty
    const line_items = items.map(item => ({
      price_data: {
        currency: 'php',
        product_data: { name: item.name },
        unit_amount: Math.round((item.price / item.quantity) * 100),  // in centavos
      },
      quantity: item.quantity,
    }));

    // Add delivery fee as its own line item
    line_items.push({
      price_data: {
        currency: 'php',
        product_data: { name: 'Delivery Fee' },
        unit_amount: 3500, // ₱35.00 in centavos
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.origin}/payment-success`,
      cancel_url: `${req.headers.origin}/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to create checkout session' });
  }
});



module.exports = router;
