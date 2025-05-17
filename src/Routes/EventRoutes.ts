import express, { Request, Response, NextFunction } from "express";
import Event from "../Model/Event";
import axios from 'axios'

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let events = await Event.find();
    if (events.length === 0) {
      
      events = [
        { sport: 'NFL', team1: 'Chiefs', team2: 'Ravens', odds1: -110, odds2: +110, date: new Date() },
        { sport: 'NBA', team1: 'Lakers', team2: 'Celtics', odds1: +120, odds2: -140, date: new Date() },
      ];
      await Event.insertMany(events);
    }
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
const footballTeams = [
  'Lions', 'Eagles', 'Tigers', 'Bears', 'Wolves', 'Hawks', 'Sharks', 'Panthers',
  'Dragons', 'Cobras', 'Vipers', 'Falcons', 'Jaguars', 'Ravens', 'Bulls', 'Stallions',
  'Knights', 'Pirates', 'Spartans', 'Giants',
];

// Generate or update events
// router.get('/', async (req, res) => {
//   try {
//     let events = await Event.find();
//     if (events.length === 0) {
//       // Seed initial events: 10 football matches, 2 dog races
//       const newEvents = [];
//       for (let i = 0; i < 10; i++) {
//         const team1 = footballTeams[i * 2];
//         const team2 = footballTeams[i * 2 + 1];
//         newEvents.push({
//           type: 'football',
//           sport: 'Virtual Football',
//           participants: [
//             { name: team1, odds: generateFootballOdds()[0].odds },
//             { name: team2, odds: generateFootballOdds()[2].odds },
//             { name: 'Draw', odds: generateFootballOdds()[1].odds },
//           ],
//           date: new Date(Date.now() + i * 5 * 60 * 1000), // Matches every 5 minutes
//           status: 'upcoming',
//         });
//       }
//       for (let i = 0; i < 2; i++) {
//         newEvents.push({
//           type: 'dog_race',
//           sport: 'Virtual Dog Racing',
//           participants: generateDogRaceOdds(),
//           date: new Date(Date.now() + (i + 10) * 5 * 60 * 1000),
//           status: 'upcoming',
//         });
//       }
//       await Event.insertMany(newEvents);
//       events = newEvents;
//     } else {
//       // Update odds and status
//       for (let event of events) {
//         if (event.status === 'upcoming' && event.date < new Date()) {
//           event.status = 'in-play';
//         }
//         if (event.status === 'in-play' && event.date < new Date(Date.now() - 3 * 60 * 1000)) {
//           event.status = 'finished';
//         }
//         event.participants = event.type === 'football' ? generateFootballOdds() : generateDogRaceOdds();
//         await event.save();
//       }
//     }
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// // Get in-play events
// router.get('/inplay', async (req, res) => {
//   try {
//     const events = await Event.find({ status: 'in-play' });
//     for (let event of events) {
//       event.participants = event.type === 'football' ? generateFootballOdds() : generateDogRaceOdds();
//       await event.save();
//     }
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// });
// router.get('/', async (req, res) => {

//   try {
//     // Fetch odds from The Odds API
//     const response = await axios.get('https://api.the-odds-api.com/v4/sports/upcoming/odds', {
//       params: {
//         apiKey: process.env.ODDS_API_KEY,
//         regions: 'us',
//         markets: 'h2h', // Moneyline odds
//         oddsFormat: 'american',
//       },
//     });


//     const events = response.data.map(event => ({
//       sport: event.sport_title,
//       team1: event.home_team,
//       team2: event.away_team,
//       odds1: event.bookmakers[0]?.markets[0]?.outcomes.find(o => o.name === event.home_team)?.price || 0,
//       odds2: event.bookmakers[0]?.markets[0]?.outcomes.find(o => o.name === event.away_team)?.price || 0,
//       date: new Date(event.commence_time),
//     }));

//     // Save to MongoDB (overwrite existing events)
//     await Event.deleteMany({});
//     await Event.insertMany(events);

//     res.json(events);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Error fetching odds' });
//   }
// });

// // Get in-play odds for in-game betting
// router.get('/inplay', async (req, res) => {
//   try {
//     const response = await axios.get('https://api.the-odds-api.com/v4/sports/upcoming/odds', {
//       params: {
//         apiKey: process.env.ODDS_API_KEY,
//         regions: 'us',
//         markets: 'h2h',
//         oddsFormat: 'american',
//       },
//     });


//     const inplayEvents = response.data
//       .filter(event => new Date(event.commence_time) < new Date())
//       .map(event => ({
//         sport: event.sport_title,
//         team1: event.home_team,
//         team2: event.away_team,
//         odds1: event.bookmakers[0]?.markets[0]?.outcomes.find(o => o.name === event.home_team)?.price || 0,
//         odds2: event.bookmakers[0]?.markets[0]?.outcomes.find(o => o.name === event.away_team)?.price || 0,
//         date: new Date(event.commence_time),
//       }));

//     res.json(inplayEvents);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Error fetching in-play odds' });
//   }
// });

// const generateRandomOdds = () => {
//   const base = Math.random() > 0.5 ? -1 : 1;
//   const value = Math.floor(Math.random() * (300 - 100) + 100); // e.g., -110, +120
//   return base * value;
// };

// // Generate or update events with random odds
// router.get('/', async (req, res) => {
//   try {
//     let events = await Event.find();
//     if (events.length === 0) {
//       // Seed initial events
//       events = [
//         { sport: 'NFL', team1: 'Chiefs', team2: 'Ravens', odds1: generateRandomOdds(), odds2: generateRandomOdds(), date: new Date(), status: 'upcoming' },
//         { sport: 'NBA', team1: 'Lakers', team2: 'Celtics', odds1: generateRandomOdds(), odds2: generateRandomOdds(), date: new Date(), status: 'upcoming' },
//       ];
//       await Event.insertMany(events);
//     } else {
//       // Update odds for all events
//       events = await Event.find();
//       for (let event of events) {
//         event.odds1 = generateRandomOdds();
//         event.odds2 = generateRandomOdds();
//         // Simulate in-play status for some events
//         if (Math.random() > 0.7 && event.status === 'upcoming') {
//           event.status = 'in-play';
//         }
//         await event.save();
//       }
//     }
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// // Get in-play events
// router.get('/inplay', async (req, res) => {
//   try {
//     const events = await Event.find({ status: 'in-play' });
//     // Update odds for in-play events
//     for (let event of events) {
//       event.odds1 = generateRandomOdds();
//       event.odds2 = generateRandomOdds();
//       await event.save();
//     }
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// const footballTeams = [
//   'Lions', 'Eagles', 'Tigers', 'Bears', 'Wolves', 'Hawks', 'Sharks', 'Panthers',
//   'Dragons', 'Cobras', 'Vipers', 'Falcons', 'Jaguars', 'Ravens', 'Bulls', 'Stallions',
//   'Knights', 'Pirates', 'Spartans', 'Giants',
// ];

// // Generate or update events
// router.get('/', async (req, res) => {
//   try {
//     let events = await Event.find();
//     if (events.length === 0) {
//       // Seed initial events: 10 football matches, 2 dog races
//       const newEvents = [];
//       for (let i = 0; i < 10; i++) {
//         const team1 = footballTeams[i * 2];
//         const team2 = footballTeams[i * 2 + 1];
//         const odds = generateFootballOdds();
//         newEvents.push({
//           type: 'football',
//           sport: 'Virtual Football',
//           participants: [
//             { name: team1, odds: odds[0].odds },
//             { name: team2, odds: odds[2].odds },
//             { name: 'Draw', odds: odds[1].odds },
//           ],
//           date: new Date(Date.now() + i * 5 * 60 * 1000), // Every 5 minutes
//           status: 'upcoming',
//         });
//       }
//       for (let i = 0; i < 2; i++) {
//         newEvents.push({
//           type: 'dog_race',
//           sport: 'Virtual Dog Racing',
//           participants: generateDogRaceOdds(),
//           date: new Date(Date.now() + (i + 10) * 5 * 60 * 1000),
//           status: 'upcoming',
//         });
//       }
//       await Event.insertMany(newEvents);
//       events = newEvents;
//     } else {
//       // Update status, odds, and results
//       for (let event of events) {
//         if (event.status === 'upcoming' && event.date < new Date()) {
//           event.status = 'in-play';
//         }
//         if (event.status === 'in-play' && event.date < new Date(Date.now() - 3 * 60 * 1000)) {
//           event.status = 'finished';
//           event.result = selectWinner(event.participants);
//           if (event.type === 'football') {
//             event.score = generateFootballScore(event.result, event.participants[0].name, event.participants[1].name);
//           }
//         }
//         if (event.status !== 'finished') {
//           event.participants = event.type === 'football' ? generateFootballOdds() : generateDogRaceOdds();
//         }
//         await event.save();
//       }
//     }
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// // Get in-play events
// router.get('/inplay', async (req, res) => {
//   try {
//     const events = await Event.find({ status: 'in-play' });
//     for (let event of events) {
//       event.participants = event.type === 'football' ? generateFootballOdds() : generateDogRaceOdds();
//       await event.save();
//     }
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// });