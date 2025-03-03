export const VALID_CLIENT_MESSAGE_TYPES = ["join", "leave"] as const;
export type ClientMessageType = (typeof VALID_CLIENT_MESSAGE_TYPES)[number];

export const VALID_SERVER_MESSAGE_TYPES = [
  "join-success",
  "leave-success",
  "users-online",
] as const;
export type ServerMessageType = (typeof VALID_SERVER_MESSAGE_TYPES)[number];

export type ClientMessage = { type: ClientMessageType; payload: any };
export type ServerMessage = { type: ServerMessageType; payload: any };
