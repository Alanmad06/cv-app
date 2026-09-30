"use server";

import { z } from "zod";

const loginSchema = z.object({
  user: z.string(),
  password: z.string(),
});

export const login = async ({
  user,
  password,
}: {
  user: string;
  password: string;
}) => {
  const result = loginSchema.safeParse({ user, password });
  if (!result.success) {
    return { access: false };
  }

  const { user: userV, password: passwordV } = result.data;

  if (userV === process.env.USER && passwordV === process.env.PASSWORD) {
    return { access: true };
  }
  return { access: false };
};
