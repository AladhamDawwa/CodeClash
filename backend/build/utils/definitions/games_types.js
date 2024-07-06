"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMode = exports.GameType = void 0;
var GameType;
(function (GameType) {
    GameType[GameType["OneVsOne"] = 0] = "OneVsOne";
    GameType[GameType["TeamVsTeam"] = 1] = "TeamVsTeam";
    GameType[GameType["LastManStanding"] = 2] = "LastManStanding";
})(GameType || (exports.GameType = GameType = {}));
var GameMode;
(function (GameMode) {
    GameMode[GameMode["Ranked"] = 0] = "Ranked";
    GameMode[GameMode["Normal"] = 1] = "Normal";
})(GameMode || (exports.GameMode = GameMode = {}));
