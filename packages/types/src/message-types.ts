import { z } from "zod";

// CLIENT MESSAGES
// ----------------------------------------------------------------------------------------------
export const CLIENT_MESSAGE = {
  JOIN: "connection:join",
  LEAVE: "connection:leave",
  MATCHMAKING_START: "matchmaking:start",
  MATCHMAKING_CANCEL: "matchmaking:cancel",
} as const;

export const ClientMessageTypeSchema = z.nativeEnum(CLIENT_MESSAGE);
export type ClientMessageType = z.infer<typeof ClientMessageTypeSchema>;

export const ClientMessageSchema = z.object({
  type: ClientMessageTypeSchema,
  payload: z.any(),
});
export type ClientMessage = z.infer<typeof ClientMessageSchema>;

export function validateClientMessage(data: unknown): ClientMessage | null {
  // console.log("input data:", data);
  try {
    const res = ClientMessageSchema.parse(data);
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// SERVER MESSAGES
// ----------------------------------------------------------------------------------------------
export const SERVER_MESSAGE = {
  JOINED: "connection:joined",
  LEFT: "connection:left",
  USERS_ONLINE: "system:users-online",
  MATCHMAKING_FOUND: "matchmaking:found",
  MATCH_STARTED: "match:started",
} as const;

export const ServerMessageTypeSchema = z.nativeEnum(SERVER_MESSAGE);
export type ServerMessageType = z.infer<typeof ServerMessageTypeSchema>;

export const ServerMessageSchema = z.object({
  type: ServerMessageTypeSchema,
  payload: z.any(),
});
export type ServerMessage = z.infer<typeof ServerMessageSchema>;

export function validateServerMessage(data: unknown): ServerMessage | null {
  try {
    const res = ServerMessageSchema.parse(data);
    return res;
  } catch (error) {
    return null;
  }
}
