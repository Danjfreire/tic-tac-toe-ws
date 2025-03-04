import { z } from "zod";
import { UserSchema } from "./user-types.js";

const MatchStateSchema = z.object({
  player1: UserSchema,
  player2: UserSchema,
  currentTurn: z.string(),
  board: z.array(z.array(z.string())),
});

export type MatchState = z.infer<typeof MatchStateSchema>;

export function validateMatchState(data: unknown): MatchState | null {
  try {
    const res = MatchStateSchema.parse(data);
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
}
