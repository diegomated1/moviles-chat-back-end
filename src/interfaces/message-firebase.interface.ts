import { TokenMessage, TopicMessage, ConditionMessage, MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";

export type Message = TokenMessage | TopicMessage | ConditionMessage | MulticastMessage;