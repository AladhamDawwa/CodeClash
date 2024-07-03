import { Team } from "../../../models/teams";
import { GameMode } from "../../../utils/definitions/games_types";
import { EloUsersMatchMakerEvaluator } from "../../evaluator/users/elo_users_match_maker_evaluator";
import { IUsersMatchMakerEvaluator } from "../../evaluator/users/i_users_match_maker_evaluator";
import { ITvTMatchMakerQueue } from "./i_tvt_match_maker_queue";

class Node {
  team: Team;
  next: Node | null;
  prev: Node | null;

  constructor(team: Team) {
    this.team = team;
    this.next = null;
    this.prev = null
  }
}

export class TvTMatchMakerQueueLocal implements ITvTMatchMakerQueue {
  private head: Node | null;
  private tail: Node | null;
  private size: number;
  private nodeMap: Map<Team, Node>
  private matchMakerEvaluator: IUsersMatchMakerEvaluator;

  constructor(type: GameMode) {
    this.head = null
    this.tail = null
    this.size = 0
    this.nodeMap = new Map()
    this.matchMakerEvaluator = new EloUsersMatchMakerEvaluator(type)
  }

  is_empty(): boolean {
    return this.size == 0
  }
  push(team: Team): void {
    const newNode = new Node(team)
    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    } else {
      newNode.prev = this.tail
      this.tail!.next = newNode
      this.tail = newNode
    }
    this.nodeMap.set(team, newNode)
    this.size++
  }
  find_best(team: Team): Team | null {
    if (this.is_empty()) {
      return null
    }
    let node = this.head
    while (node != null) {
      if (this.matchMakerEvaluator.is_good_match(node.team.mmr, team.mmr)) {
        const matched_user = node.team
        this.remove(matched_user)
        return matched_user
      }
      node = node.next
    }
    return null

  }
  get_all_data(): Team[] {
    let node = this.head
    const users: Team[] = []
    while (node != null) {
      users.push(node.team)
      node = node.next
    }
    return users
  }
  remove(team: Team) {
    const nodeToRemove = this.nodeMap.get(team)
    if (!nodeToRemove) {
      return
    }
    if (nodeToRemove?.prev) {
      nodeToRemove!.prev.next = nodeToRemove!.next
    }
    else {
      this.head = nodeToRemove!.next
    }

    if (nodeToRemove!.next) {
      nodeToRemove!.next.prev = nodeToRemove!.prev
    }
    else {
      this.tail = nodeToRemove!.prev
    }
    this.nodeMap.delete(team)
    this.size--;
  }
}
