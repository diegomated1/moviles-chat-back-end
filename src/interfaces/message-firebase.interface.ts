import { TokenMessage, TopicMessage, ConditionMessage } from "firebase-admin/lib/messaging/messaging-api";

export type Message = TokenMessage | TopicMessage | ConditionMessage;