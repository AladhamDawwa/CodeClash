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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const users_1 = require("../models/users");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authentication_1 = require("../middlewares/authentication");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { TOKEN_SECRET } = process.env;
class UsersController {
    static signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = req.body;
            const user_exists = yield users_1.Users.user_exists(user.username);
            if (user_exists) {
                res.status(400).json({ error: "username already exists" });
                return;
            }
            const email_exists = yield users_1.Users.email_exists(user.email);
            if (email_exists) {
                res.status(400).json({ error: "email already exists" });
                return;
            }
            user = yield users_1.Users.create(user.first_name, user.last_name, user.email, user.username, user.password);
            const token = jsonwebtoken_1.default.sign({ username: user.username }, TOKEN_SECRET);
            res.json({ user: user, token: token });
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let username_or_email;
            if ('email' in req.body) {
                username_or_email = req.body.email;
            }
            else {
                username_or_email = req.body.username;
            }
            const user = yield users_1.Users.login(username_or_email, req.body.password);
            if (!user) {
                return res.status(401).json({ error: "username/email or passowrd is incorrect" });
            }
            const token = jsonwebtoken_1.default.sign({ username: user.username }, TOKEN_SECRET);
            res.json({ user: user, token: token });
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let new_user = req.body.new_user;
            let username = req.body.username;
            new_user = yield users_1.Users.update(new_user, username);
            res.json({ user: new_user });
        });
    }
    static routes(app) {
        app.post("/users/signup", this.signup);
        app.post("/users/login", this.login);
        app.put("/users", authentication_1.authenticate, this.update);
    }
}
exports.UsersController = UsersController;
