"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameType = exports.GameMode = void 0;
var GameMode;
(function (GameMode) {
    GameMode[GameMode["OneVsOne"] = 0] = "OneVsOne";
    GameMode[GameMode["TeamVsTeam"] = 1] = "TeamVsTeam";
    GameMode[GameMode["LastManStanding"] = 2] = "LastManStanding";
})(GameMode || (exports.GameMode = GameMode = {}));
var GameType;
(function (GameType) {
    GameType[GameType["Normal"] = 0] = "Normal";
    GameType[GameType["Ranked"] = 1] = "Ranked";
})(GameType || (exports.GameType = GameType = {}));
