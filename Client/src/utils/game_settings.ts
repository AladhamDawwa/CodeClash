enum GameType {
  OneVsOne,
  TeamVsTeam,
  LastManStanding
}

// enum GameTypeString {
//   OneVsOne = "1 vs 1",
//   TeamVsTeam = '3 vs 3',
//   LastManStanding = 'LastManStanding'
// }

const GameTypeString = [
  "1 vs 1",
  '3 vs 3',
  'LastManStanding'
]

enum GameMode {
  Ranked,
  Normal
}

export { GameType, GameMode, GameTypeString };
