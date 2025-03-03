import { z } from "zod";

// CLIENT MESSAGES
// ----------------------------------------------------------------------------------------------
export const VALID_CLIENT_MESSAGE_TYPES = ["join", "leave"] as const;
export const ClientMessageTypeSchema = z.enum(VALID_CLIENT_MESSAGE_TYPES);
export type ClientMessageType = z.infer<typeof ClientMessageTypeSchema>;

export const ClientMessageSchema = z.object({
  type: ClientMessageTypeSchema,
  payload: z.unknown(),
});
export type ClientMessage = z.infer<typeof ClientMessageSchema>;

// SERVER MESSAGES
// ----------------------------------------------------------------------------------------------
export const VALID_SERVER_MESSAGE_TYPES = [
  "join-success",
  "leave-success",
  "users-online",
] as const;
export const ServerMessageTypeSchema = z.enum(VALID_SERVER_MESSAGE_TYPES);
export type ServerMessageType = z.infer<typeof ServerMessageTypeSchema>;

export const ServerMessageSchema = z.object({
  type: ServerMessageTypeSchema,
  payload: z.unknown(),
});
export type ServerMessage = z.infer<typeof ServerMessageSchema>;
