import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcryptjs from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const salt = await bcryptjs.genSalt(10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@school.ac.id" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@school.ac.id",
      password: await bcryptjs.hash("adminku123", salt),
      role: "ADMIN",
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
