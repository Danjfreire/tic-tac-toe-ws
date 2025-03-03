export const VALID_CLIENT_MESSAGE_TYPES = [
  "join",
  "connect",
  "disconnect",
] as const;
export type ClientMessageType = (typeof VALID_CLIENT_MESSAGE_TYPES)[number];

export const VALID_SERVER_MESSAGE_TYPES = [
  "join-success",
  "users-online",
] as const;
export type ServerMessageType = (typeof VALID_SERVER_MESSAGE_TYPES)[number];

export type ClientMessage = { type: ClientMessageType; payload: any };
export type ServerMessage = { type: ServerMessageType; payload: any };
