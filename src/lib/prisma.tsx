// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"], // ปิดได้ใน production
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// (ออปชัน) health check ฟังก์ชันสั้น ๆ
export async function dbReady() {
  await prisma.$queryRaw`SELECT 1`;
  return true;
}
