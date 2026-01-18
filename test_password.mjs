import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const user = await prisma.user.findUnique({
  where: { email: 'danielleglazier@yahoo.com' },
  select: { 
    id: true,
    email: true,
    passwordHash: true
  }
});

console.log('Testing password for:', user.email);

const testPassword = 'AdminTemp2026!';
const isValid = await bcrypt.compare(testPassword, user.passwordHash);

console.log('Password "AdminTemp2026!":', isValid ? '✅ VALID' : '❌ INVALID');

// Test what we actually set it to
const expectedHash = await bcrypt.hash(testPassword, 10);
console.log('\nCurrent hash starts with:', user.passwordHash.substring(0, 30));
console.log('Test hash would start with:', expectedHash.substring(0, 30));

await prisma.$disconnect();
