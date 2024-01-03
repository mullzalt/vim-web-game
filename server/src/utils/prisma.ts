import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// export default async function connectDB() {
//   try {
//     await prisma.$connect();
//     console.log("Successfully connected to database.");
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   } finally {
//     await prisma.$disconnect();
//   }
// }
