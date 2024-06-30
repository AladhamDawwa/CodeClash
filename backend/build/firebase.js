"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.firestore = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const firebase_config = require("./config/firebase").firebase;
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(firebase_config)
});
// firestore
exports.firestore = (0, firestore_1.getFirestore)();
exports.db = {
    users: exports.firestore.collection("users"),
    uvu_games: exports.firestore.collection("uvu_games"),
    problems: exports.firestore.collection("problems"),
    testcases: exports.firestore.collection("testcases"),
    users_unsolved_problems: exports.firestore.collection("users_unsolved_problems"),
    tiers: exports.firestore.collection("tiers"),
    problem_levels: exports.firestore.collection("problem_levels"),
    submissions: exports.firestore.collection("submissions"),
    teams: exports.firestore.collection("teams"),
    uvu_games_history: exports.firestore.collection("uvu_games_history")
};
