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
    GameMode[GameMode["Normal"] = 0] = "Normal";
    GameMode[GameMode["Ranked"] = 1] = "Ranked";
})(GameMode || (exports.GameMode = GameMode = {}));
