import express, { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { auth, AuthRequest } from "../middleware/auth";
import User from "../Model/User";
import Transaction from "../Model/Transaction";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const router = express.Router();

router.post('/deposit', auth, async (req:AuthRequest, res:Response) => {
  const { amount } = req.body; // Amount in USD
  try {
    let user = await User.findById(req.user?.userId);
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.username + '@example.com',
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ msg: 'Payment error' });
  }
});

// Confirm deposit and update balance
router.post('/deposit/confirm', auth, async (req:AuthRequest, res:Response) => {
  const { paymentIntentId, amount } = req.body;
  try {
    const user = await User.findById(req.user?.userId);
    const transaction = new Transaction({
      userId: user._id,
      amount,
      type: 'deposit',
      stripePaymentId: paymentIntentId,
    });
    await transaction.save();

    user.balance += amount;
    user.transactions.push(transaction._id);
    await user.save();

    res.json({ msg: 'Deposit successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Error confirming deposit' });
  }
});

export default router