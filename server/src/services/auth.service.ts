import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../types/errors.js";
import { RegisterInput, LoginInput } from "../schemas/auth.schema.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const BCRYPT_ROUNDS = 12;

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateTokens(userId: string) {
  const accessToken = jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const rawRefreshToken = crypto.randomBytes(64).toString("hex");
  const tokenHash = hashToken(rawRefreshToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.REFRESH_TOKEN_DAYS);

  return { accessToken, rawRefreshToken, tokenHash, expiresAt };
}

export async function register(input: RegisterInput) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: input.email }, { username: input.username }],
    },
  });

  if (existingUser) {
    throw new AppError("CONFLICT", "Username or email is already taken", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      passwordHash,
      displayName: input.displayName,
    },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      about: true,
      createdAt: true,
    },
  });

  const { accessToken, rawRefreshToken, tokenHash, expiresAt } = generateTokens(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  return { user, accessToken, refreshToken: rawRefreshToken };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AppError("INVALID_CREDENTIALS", "Invalid email or password", 401);
  }

  const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValidPassword) {
    throw new AppError("INVALID_CREDENTIALS", "Invalid email or password", 401);
  }

  const { accessToken, rawRefreshToken, tokenHash, expiresAt } = generateTokens(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  const sanitizedUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    about: user.about,
    createdAt: user.createdAt,
  };

  return { user: sanitizedUser, accessToken, refreshToken: rawRefreshToken };
}

export async function refresh(rawRefreshToken?: string) {
  if (!rawRefreshToken) {
    throw new AppError("UNAUTHORIZED", "Refresh token is missing", 401);
  }

  const tokenHash = hashToken(rawRefreshToken);
  const storedToken = await prisma.refreshToken.findFirst({
    where: { tokenHash },
  });

  if (!storedToken || storedToken.revokedAt || storedToken.expiresAt <= new Date()) {
    throw new AppError("UNAUTHORIZED", "Invalid or expired refresh token", 401);
  }

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  });

  const { accessToken, rawRefreshToken: newRefreshToken, tokenHash: newTokenHash, expiresAt } =
    generateTokens(storedToken.userId);

  await prisma.refreshToken.create({
    data: {
      userId: storedToken.userId,
      tokenHash: newTokenHash,
      expiresAt,
    },
  });

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(rawRefreshToken?: string) {
  if (!rawRefreshToken) {
    return;
  }

  const tokenHash = hashToken(rawRefreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
