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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchMakerHandler = void 0;
class MatchMakerHandler {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.bind_methods();
    }
    find_match(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.emit("match_maker:found_match", { message: "some_message" });
        });
    }
    register_events() {
        this.socket.on("match_maker:find_match", this.find_match);
    }
    bind_methods() {
        this.find_match = this.find_match.bind(this);
    }
}
exports.MatchMakerHandler = MatchMakerHandler;
