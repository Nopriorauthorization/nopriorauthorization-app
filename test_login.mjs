import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const user = await prisma.user.findUnique({
  where: { email: 'danielleglazier@yahoo.com' },
  select: { 
    id: true,
    email: true, 
    role: true,
    isDisabled: true,
    createdAt: true
  }
});

console.log('User account status:');
console.log(JSON.stringify(user, null, 2));

await prisma.$disconnect();
