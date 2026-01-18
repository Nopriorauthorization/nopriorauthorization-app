import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const newPassword = 'admin123';
const passwordHash = await bcrypt.hash(newPassword, 10);

const user = await prisma.user.update({
  where: { email: 'danielleglazier@yahoo.com' },
  data: { passwordHash },
  select: { id: true, email: true, role: true }
});

console.log('✅ Password updated for:', user.email);
console.log('New password:', newPassword);

await prisma.$disconnect();
