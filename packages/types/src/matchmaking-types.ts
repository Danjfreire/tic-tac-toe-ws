import { z } from "zod";
import { UserSchema } from "./user-types.js";

const MatchConfirmationSchema = z.object({
  id: z.string(),
  player1Id: z.string(),
  player2Id: z.string(),
  playersAccepted: z.array(z.string()),
});

export type MatchConfirmation = z.infer<typeof MatchConfirmationSchema>;

export function validateMatchConfirmation(
  data: unknown
): MatchConfirmation | null {
  try {
    const res = MatchConfirmationSchema.parse(data);
    return res;
  } catch (error) {
    return null;
  }
}

const MatchmakingAcceptSchema = z.object({
  matchId: z.string(),
  user: UserSchema,
});

export type MatchmakingAccept = z.infer<typeof MatchmakingAcceptSchema>;

export function validateMatchmakingAccept(
  data: unknown
): MatchmakingAccept | null {
  try {
    const res = MatchmakingAcceptSchema.parse(data);
    return res;
  } catch (error) {
    return null;
  }
}
