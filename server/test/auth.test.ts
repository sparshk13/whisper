import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import { app } from "../src/app.js";
import { prisma } from "../src/db/prisma.js";

vi.mock("../src/db/prisma.js", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

describe("Auth Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("rejects password shorter than 8 characters", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "short",
        displayName: "Test User",
      });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("rejects invalid email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "not-an-email",
        password: "password123",
        displayName: "Test User",
      });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("rejects duplicate email or username with 409", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
        id: "existing-uuid",
      } as any);

      const res = await request(app).post("/api/auth/register").send({
        username: "existing",
        email: "existing@example.com",
        password: "password123",
        displayName: "Existing User",
      });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe("CONFLICT");
    });

    it("registers a new user and sets refresh cookie", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(null);
      vi.mocked(prisma.user.create).mockResolvedValueOnce({
        id: "new-user-id",
        username: "newuser",
        email: "newuser@example.com",
        displayName: "New User",
        avatarUrl: null,
        about: null,
        createdAt: new Date(),
      } as any);
      vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({} as any);

      const res = await request(app).post("/api/auth/register").send({
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
        displayName: "New User",
      });

      expect(res.status).toBe(201);
      expect(res.body.user.username).toBe("newuser");
      expect(res.body.accessToken).toBeDefined();
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("POST /api/auth/login", () => {
    it("returns 401 on wrong password", async () => {
      const passwordHash = await bcrypt.hash("correct-password", 12);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: "user-id",
        email: "user@example.com",
        passwordHash,
      } as any);

      const res = await request(app).post("/api/auth/login").send({
        email: "user@example.com",
        password: "wrong-password",
      });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
    });

    it("logs in successfully with valid credentials", async () => {
      const passwordHash = await bcrypt.hash("password123", 12);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: "user-id",
        username: "validuser",
        email: "valid@example.com",
        passwordHash,
        displayName: "Valid User",
        avatarUrl: null,
        about: null,
        createdAt: new Date(),
      } as any);
      vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({} as any);

      const res = await request(app).post("/api/auth/login").send({
        email: "valid@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe("valid@example.com");
      expect(res.body.accessToken).toBeDefined();
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("rejects request without refresh cookie with 401", async () => {
      const res = await request(app).post("/api/auth/refresh");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("rotates refresh token and returns new access token", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      vi.mocked(prisma.refreshToken.findFirst).mockResolvedValueOnce({
        id: "token-id",
        userId: "user-id",
        expiresAt: futureDate,
        revokedAt: null,
      } as any);
      vi.mocked(prisma.refreshToken.update).mockResolvedValueOnce({} as any);
      vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({} as any);

      const res = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", ["refreshToken=some-valid-token-string"]);

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(vi.mocked(prisma.refreshToken.update)).toHaveBeenCalled();
    });
  });

  describe("POST /api/auth/logout", () => {
    it("revokes token and returns 204", async () => {
      vi.mocked(prisma.refreshToken.updateMany).mockResolvedValueOnce({ count: 1 } as any);

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", ["refreshToken=token-to-revoke"]);

      expect(res.status).toBe(204);
    });
  });
});
