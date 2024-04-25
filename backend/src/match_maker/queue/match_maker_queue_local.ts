import { User } from "../../models/users";
import { EloMatchMakerEvaluator } from "../evaluator/elo_match_maker_evaluator";
import { IMatchMakerEvaluator } from "../evaluator/match_maker_evaluator";
import { IMatchMakerQueue } from "./match_maker_queue";

class Node {
  user: User;
  next: Node | null;
  prev: Node | null;

  constructor(user: User) {
      this.user = user;
      this.next = null;
      this.prev = null
  }
}

export class MatchMakerQueueLocal implements IMatchMakerQueue {
  private head: Node | null;
  private tail: Node | null;
  private size: number;
  private nodeMap: Map<User,Node>
  private matchMakerEvaluator: IMatchMakerEvaluator = new EloMatchMakerEvaluator()

  constructor() {
    this.head = null
    this.tail = null
    this.size = 0
    this.nodeMap = new Map()
  }
  
  is_empty(): boolean {
    return this.size == 0
  }
  push(user: User): void {
    const newNode = new Node(user)
    if(!this.head)
    {
      this.head = newNode
      this.tail = newNode
    } else {
        newNode.prev = this.tail
        this.tail!.next = newNode
        this.tail =newNode
    }
    this.nodeMap.set(user,newNode)
    this.size++
  }
  find_best(user: User): User | null {
    if(this.is_empty()){
      return null
    }
    let node = this.head
    while(node != null) {
        if(this.matchMakerEvaluator.is_good_match(node.user,user)) {
          const matched_user = node.user
          this.remove(matched_user)
          return matched_user
        }
        node = node.next
    }
    return null

  }
  get_all_data(): User[] {
    let node = this.head
    const users: User[] = []
    while(node != null)
    {
      users.push(node.user)
      node = node.next
    }
    return users
  }
  remove(user: User) {
    const nodeToRemove = this.nodeMap.get(user)
    if(nodeToRemove?.prev) {
      nodeToRemove!.prev.next = nodeToRemove!.next
    }
    else {
      this.head = nodeToRemove!.next
    }

    if(nodeToRemove!.next) {
      nodeToRemove!.next.prev = nodeToRemove!.prev
    }
    else {
      this.tail = nodeToRemove!.prev
    }
    this.nodeMap.delete(user)
    this.size--;
  }
}
