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
exports.MatchMakerService = void 0;
const match_maker_queue_local_1 = require("../match_maker/match_maker_queue_local");
const users_1 = require("../models/users");
class MatchMakerService {
    static find_one_v_one(user_socket_info) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_rank = yield users_1.Users.get_rank(user_socket_info.username);
            if (this.match_maker_queue.is_empty(user_rank)) {
                this.match_maker_queue.push(user_rank, user_socket_info);
                return null;
            }
            const matched_user_socket_info = this.match_maker_queue.get_front(user_rank);
            this.match_maker_queue.pop(user_rank);
            return [
                user_socket_info,
                matched_user_socket_info,
            ];
        });
    }
}
exports.MatchMakerService = MatchMakerService;
MatchMakerService.match_maker_queue = new match_maker_queue_local_1.MatchMakerQueueLocal();
