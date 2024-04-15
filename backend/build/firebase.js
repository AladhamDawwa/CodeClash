"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const firebase_config = require("./config/firebase").firebase;
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(firebase_config)
});
// firestore
const firestore = (0, firestore_1.getFirestore)();
exports.db = {
    users: firestore.collection("users")
};
