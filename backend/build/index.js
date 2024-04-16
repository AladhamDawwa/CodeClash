"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_1 = require("./controllers/users");
dotenv_1.default.config();
const port = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// routes
users_1.UsersController.routes(app);
app.listen(port, () => {
    console.log(`Listening on port : ${port}`);
});
