export const generateFootballOdds = () => {
  // Weighted odds: Favorite (lower odds), Draw (higher), Underdog (medium)
  const favorite = (1.5 + Math.random() * 1.5).toFixed(2); // 1.5–3.0
  const draw = (3.0 + Math.random() * 1.5).toFixed(2); // 3.0–4.5
  const underdog = (2.5 + Math.random() * 2.5).toFixed(2); // 2.5–5.0
  return [
    { name: 'win1', odds: parseFloat(favorite) },
    { name: 'draw', odds: parseFloat(draw) },
    { name: 'win2', odds: parseFloat(underdog) },
  ];
};

export const generateDogRaceOdds = () => {
  const dogs = [];
  for (let i = 1; i <= 8; i++) {
    // Weighted: Lower-numbered dogs are favorites
    const odds = (i === 1 ? 2.0 : i === 2 ? 3.0 : 4.0 + (i - 2) * 1.5).toFixed(2);
    dogs.push({ name: `Dog ${i}`, odds: parseFloat(odds) });
  }
  return dogs;
};

// const generateFootballOdds = () => {
//   const favorite = (1.5 + Math.random() * 1.5).toFixed(2); // 1.5–3.0
//   const draw = (3.0 + Math.random() * 1.5).toFixed(2); // 3.0–4.5
//   const underdog = (2.5 + Math.random() * 2.5).toFixed(2); // 2.5–5.0
//   return [
//     { name: 'win1', odds: parseFloat(favorite) },
//     { name: 'draw', odds: parseFloat(draw) },
//     { name: 'win2', odds: parseFloat(underdog) },
//   ];
// };

// const generateDogRaceOdds = () => {
//   const dogs = [];
//   for (let i = 1; i <= 8; i++) {
//     const odds = (i === 1 ? 2.0 : i === 2 ? 3.0 : 4.0 + (i - 2) * 1.5).toFixed(2);
//     dogs.push({ name: `Dog ${i}`, odds: parseFloat(odds) });
//   }
//   return dogs;
// };
// Convert odds to probabilities and select winner
// const selectWinner = (participants) => {
//   // Convert odds to implied probabilities (1/odds)
//   const totalInverseOdds = participants.reduce((sum, p) => sum + 1 / p.odds, 0);
//   const probabilities = participants.map(p => (1 / p.odds) / totalInverseOdds);

//   // RNG: Generate random number between 0 and 1
//   const random = Math.random();
//   let cumulative = 0;
//   for (let i = 0; i < probabilities.length; i++) {
//     cumulative += probabilities[i];
//     if (random <= cumulative) {
//       return participants[i].name;
//     }
//   }
//   return participants[participants.length - 1].name; // Fallback
// };

// // Generate random football score based on winner
// const generateFootballScore = (winner, team1, team2) => {
//   if (winner === 'draw') {
//     const score = Math.floor(Math.random() * 3); // 0-0, 1-1, 2-2
//     return `${score}-${score}`;
//   }
//   const winningScore = Math.floor(Math.random() * 3) + 1; // 1–3
//   const losingScore = Math.floor(Math.random() * winningScore); // 0–(winningScore-1)
//   return winner === team1 ? `${winningScore}-${losingScore}` : `${losingScore}-${winningScore}`;
// };