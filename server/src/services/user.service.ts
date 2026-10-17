import { prisma } from "../db/prisma.js";
import { AppError } from "../types/errors.js";

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      about: true,
      lastSeenAt: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }

  return user;
}
