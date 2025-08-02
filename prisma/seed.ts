import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@teampulse.dev' },
    update: {},
    create: {
      email: 'admin@teampulse.dev',
      password: 'password123',
    },
  });
}

main().finally(() => prisma.$disconnect());
