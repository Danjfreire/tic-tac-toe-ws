import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export function isUser(data: unknown): boolean {
  return UserSchema.safeParse(data).success;
}

export function validateUser(data: unknown): User | null {
  try {
    const res = UserSchema.parse(data);
    return res;
  } catch (error) {
    return null;
  }
}
