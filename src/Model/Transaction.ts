import mongoose  from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
  stripePaymentId: { type: String, required: true },
  status: { type: String, default: 'completed' },
  createdAt: { type: Date, default: Date.now },
});

// module.exports = mongoose.model('Transaction', transactionSchema);
// export default mongoose.models.User || mongoose.model<IUser>('User', transactionSchema);
export default mongoose.models.Transaction || mongoose.model('User', transactionSchema);