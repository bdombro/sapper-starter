import { PrismaClient } from "@prisma/client"

export const db = new PrismaClient()
export default db;

const handleExit = (signal) => {
  console.log(`Prisma Received exit signal ${signal}`);
  db.$disconnect()
  console.log("Disconnected");
}
process.on('exit', handleExit);
process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);