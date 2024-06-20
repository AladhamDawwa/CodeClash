"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const firestore_1 = require("firebase-admin/firestore");
const firebase_1 = require("../firebase");
const bcrypt_1 = __importDefault(require("bcrypt"));
const rank_tier_1 = require("../utils/definitions/rank_tier");
const dotenv_1 = __importDefault(require("dotenv"));
const users_unsolved_problems_1 = require("./users_unsolved_problems");
dotenv_1.default.config();
const { SALT_ROUNDS, PEPPER } = process.env;
const converter = {
    toFirestore: (data) => {
        const { doc_id } = data, userData = __rest(data, ["doc_id"]);
        return userData;
    },
    fromFirestore: (snap) => {
        const data = snap.data();
        return {
            doc_id: snap.id,
            description: data.description,
            email: data.email,
            exp: data.exp,
            first_name: data.first_name,
            image: data.image,
            last_name: data.last_name,
            level: data.level,
            password: data.password,
            rank_points: data.rank_points,
            rank_tier: data.rank_tier,
            registeration_date: data.registeration_date,
            username: data.username,
            mmr: data.mmr,
            profile_image_id: data.profile_image_id
        };
    },
};
const users_collection = firebase_1.db.users.withConverter(converter);
class Users {
    static index() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield users_collection.get();
            const users = snapshot.docs.map((doc) => doc.data());
            return users;
        });
    }
    static create(first_name, last_name, email, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt_rounds = SALT_ROUNDS;
            password = bcrypt_1.default.hashSync(password + PEPPER, parseInt(salt_rounds));
            const user_creation_args = this.create_user_args(first_name, last_name, email, username, password);
            const ref = yield users_collection.add(this.create_user_args(first_name, last_name, email, username, password));
            users_unsolved_problems_1.UsersUnsolvedProblems.init(username);
            delete user_creation_args.password;
            return user_creation_args;
        });
    }
    static get_by_username(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield users_collection
                .where("username", "==", username)
                .get();
            const user = snapshot.docs[0].data();
            delete user.password;
            delete user.doc_id;
            return user;
        });
    }
    static get_rank(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield users_collection
                .where("username", "==", username)
                .get();
            const user = snapshot.docs[0].data();
            return user.rank_tier;
        });
    }
    static user_exists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield users_collection
                .where("username", "==", username)
                .get();
            if (snapshot.empty) {
                return false;
            }
            return true;
        });
    }
    static email_exists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield users_collection.where("email", "==", email).get();
            if (snapshot.empty) {
                return false;
            }
            return true;
        });
    }
    static login(username_or_email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield users_collection
                .where(firestore_1.Filter.or(firestore_1.Filter.where("username", "==", username_or_email), firestore_1.Filter.where("email", "==", username_or_email)))
                .get();
            if (!snapshot.empty) {
                const user = snapshot.docs[0].data();
                if (bcrypt_1.default.compareSync(password + PEPPER, user.password)) {
                    delete user.password;
                    return user;
                }
            }
            return null;
        });
    }
    static update(new_user, username) {
        return __awaiter(this, void 0, void 0, function* () {
            if ("password" in new_user) {
                const salt_rounds = SALT_ROUNDS;
                new_user.password = bcrypt_1.default.hashSync(new_user.password + PEPPER, parseInt(salt_rounds));
            }
            const snapshot = yield users_collection
                .where("username", "==", username)
                .get();
            const user_doc = snapshot.docs[0];
            const res = yield users_collection.doc(user_doc.id).update(new_user);
            return new_user;
        });
    }
    static create_user_args(first_name, last_name, email, username, password) {
        return {
            email: email,
            exp: 0,
            first_name: first_name,
            last_name: last_name,
            level: 0,
            password: password,
            rank_points: 0,
            rank_tier: rank_tier_1.RankTier.Bronze,
            registeration_date: firestore_1.Timestamp.now(),
            username: username,
            mmr: 800,
        };
    }
}
exports.Users = Users;
