import { Document, Model } from 'mongoose';
import { parentPort } from 'worker_threads';
import { connectDb } from '../config/db';
import { TransactionModel } from '../Model/transaction';
const saveTransaction = async <T extends Document>(
  SchemaType: Model<T>,
  transactionData: Partial<T>
): Promise<T> => {
  try {
    const savedTransaction = await SchemaType.create(transactionData);
    console.log('Transaction saved to DB:', savedTransaction);
    return savedTransaction;
  } catch (error) {
    console.error('Error saving transaction to DB in worker:', error);
    throw error;
  }
};

(async () => {
  try {
    await connectDb();
    console.log('Database connected in worker');
  } catch (error: any) {
    console.error('Error during worker initialization:', error);
    parentPort?.postMessage({ status: 'error', error: error.message });
  }
})();

parentPort?.on('message', async (message: any) => {
  const { type, data } = message;
  console.log('Message received in worker:', type, data);

  try {
    switch (type) {
      case 'saveTransaction':
        const savedTransaction = await saveTransaction(TransactionModel, data);
        parentPort?.postMessage({ status: 'success', txData: savedTransaction });
        console.log('Transaction saved and data sent back to main thread:', savedTransaction);
        break;

      default:
        parentPort?.postMessage({ status: 'error', error: 'Unknown job type' });
        break;
    }
  } catch (error: any) {
    console.error('Error handling message:', error);
    parentPort?.postMessage({ status: 'error', error: error.message });
  }
});
