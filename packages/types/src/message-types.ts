export const VALID_MESSAGE_TYPES = ["join", "connect", "disconnect"] as const;
export type MessageType = (typeof VALID_MESSAGE_TYPES)[number];
