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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { TOKEN_SECRET } = process.env;
class UsersController {
    static signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body;
            const token = jsonwebtoken_1.default.sign({ username: user.username }, '' + TOKEN_SECRET);
            console.log(user);
            res.json(token);
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static user_routes(app) {
        app.post('/users/signup', this.signup);
    }
}
exports.UsersController = UsersController;
