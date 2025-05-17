import express, { Request, Response, NextFunction } from "express";
import User from "../Model/User";
import Bet from "../Model/Bet";
import { auth, AuthRequest, IUserJwt } from "../middleware/auth";
const router = express.Router();


router.post('/', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { eventId, amount, selection, type } = req.body;

  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
        res.status(400).json({ msg: 'User not found' });
      return
    }

    if (user.balance < amount) {
        res.status(400).json({ msg: 'Insufficient balance' });
      return
    }

    const bet = new Bet({
      userId: req.user?.userId as string,  
      eventId,
      amount,
      selection,
            // type: type || 'pre-match',
    });

    await bet.save();

    user.balance -= amount;  
    await user.save();

    res.json(bet);  
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});




router.get('/', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bets = await Bet.find({ userId: req.user?.userId }).populate('eventId');
    res.json(bets);  
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;


// router.post('/', auth, async (req, res) => {
//   const { eventId, amount, selection, type } = req.body;
//   try {
//     const user = await User.findById(req.user.userId);
//     if (user.balance < amount) return res.status(400).json({ msg: 'Insufficient balance' });

//     const event = await Event.findById(eventId);
//     if (!event) return res.status(400).json({ msg: 'Event not found' });
//     if (type === 'in-play' && event.status !== 'in-play') return res.status(400).json({ msg: 'Event not in-play' });
//     if (!event.participants.some(p => p.name === selection)) return res.status(400).json({ msg: 'Invalid selection' });

//     const bet = new Bet({
//       userId: req.user.userId,
//       eventId,
//       amount,
//       selection,
//       type: type || 'pre-match',
//     });
//     await bet.save();

//     user.balance -= amount;
//     await user.save();

//     res.json(bet);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// // Get user bets
// router.get('/', auth, async (req, res) => {
//   try {
//     const bets = await Bet.find({ userId: req.user.userId }).populate('eventId');
//     res.json(bets);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// // Settle bets for finished events
// router.post('/settle', auth, async (req, res) => {
//   try {
//     const bets = await Bet.find({ userId: req.user.userId, status: 'pending' }).populate('eventId');
//     for (let bet of bets) {
//       if (bet.eventId.status === 'finished') {
//         if (bet.selection === bet.eventId.result) {
//           const odds = bet.eventId.participants.find(p => p.name === bet.selection).odds;
//           const payout = bet.amount * odds;
//           const user = await User.findById(bet.userId);
//           user.balance += payout;
//           await user.save();
//           bet.status = 'won';
//         } else {
//           bet.status = 'lost';
//         }
//         await bet.save();
//       }
//     }
//     res.json({ msg: 'Bets settled' });
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

