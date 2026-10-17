import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const ali = await prisma.user.upsert({
    where: { email: "ali@whisper.chat" },
    update: {},
    create: {
      username: "ali",
      email: "ali@whisper.chat",
      passwordHash,
      displayName: "Ali Khan",
      about: "Exploring real-time web tech.",
    },
  });

  const sara = await prisma.user.upsert({
    where: { email: "sara@whisper.chat" },
    update: {},
    create: {
      username: "sara",
      email: "sara@whisper.chat",
      passwordHash,
      displayName: "Sara Chen",
      about: "Design and frontend engineer.",
    },
  });

  const leo = await prisma.user.upsert({
    where: { email: "leo@whisper.chat" },
    update: {},
    create: {
      username: "leo",
      email: "leo@whisper.chat",
      passwordHash,
      displayName: "Leo Silva",
      about: "Always online.",
    },
  });

  const existingGroup = await prisma.conversation.findFirst({
    where: { type: "group", name: "Study Group" },
  });

  if (!existingGroup) {
    await prisma.conversation.create({
      data: {
        type: "group",
        name: "Study Group",
        createdBy: ali.id,
        members: {
          create: [
            { userId: ali.id, role: "admin" },
            { userId: sara.id, role: "member" },
            { userId: leo.id, role: "member" },
          ],
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
