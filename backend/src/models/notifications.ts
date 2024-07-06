import { db } from "../firebase";
import dotenv from "dotenv";
dotenv.config();

export type systemNotification = {
  doc_id?: string;
  from: string;
  to: string;
  type: NotificationType;
  message: string;
};

export enum NotificationType {
  TeamInvitation
}

const converter = {
  toFirestore: (data: systemNotification) => {
    return data;
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();
    return {
      doc_id: snap.id,
      from: data.from,
      to: data.to,
      type: data.type,
      message: data.message,
    };
  },
};

const notifications_collection = db.notifications.withConverter(converter);

export class Notifications {
  static async create(notification: systemNotification): Promise<string> {
    const ref = await notifications_collection.add(notification);
    return ref.id;
  }

  static async delete(doc_id: string) {
    const ref = notifications_collection.doc(doc_id);
    await ref.delete();
  }

  static async update(new_notification: systemNotification, doc_id: string) {
    const ref = notifications_collection.doc(doc_id);
    await ref.update(new_notification);
  }

  static async get(doc_id: string): Promise<systemNotification | null> {
    const ref = notifications_collection.doc(doc_id);
    const doc = await ref.get();
    if (!doc.exists) {
      return null;
    }
    const notification = doc.data();
    return notification!;
  }

  static async add_notification(from: string, to: string, type: NotificationType, message: string): Promise<string> {
    const notification = {
      from: from,
      to: to,
      type: type,
      message: message,
    };
    const ref = await notifications_collection.add(notification);
    return ref.id;
  }

  static async get_user_notifications(username: string): Promise<systemNotification[]> {
    const snapshot = await notifications_collection.where("to", "==", username).get();
    const notifications = snapshot.docs.map((doc) => doc.data());
    return notifications;
  }

  static async remove_notification(doc_id: string) {
    const ref = notifications_collection.doc(doc_id);
    await ref.delete();
  }
}
