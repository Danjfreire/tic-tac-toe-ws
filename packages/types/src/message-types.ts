import { z } from "zod";

// CLIENT MESSAGES
// ----------------------------------------------------------------------------------------------
export const VALID_CLIENT_MESSAGE_TYPES = [
  "join",
  "leave",
  "find-match",
] as const;
export const ClientMessageTypeSchema = z.enum(VALID_CLIENT_MESSAGE_TYPES);
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
    console.log("Invalid message received from client, failed zed validation");
    return null;
  }
}

// SERVER MESSAGES
// ----------------------------------------------------------------------------------------------
export const VALID_SERVER_MESSAGE_TYPES = [
  "join-success",
  "leave-success",
  "users-online",
  "match-started",
  "match-update",
] as const;
export const ServerMessageTypeSchema = z.enum(VALID_SERVER_MESSAGE_TYPES);
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
