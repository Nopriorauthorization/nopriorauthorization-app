const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  try {
    // Update LAB to LAB_RESULT before schema change
    const result = await prisma.$executeRaw`
      UPDATE "Document" 
      SET category = 'LAB_RESULT' 
      WHERE category = 'LAB'
    `;
    
    console.log(`✅ Migrated ${result} documents from LAB to LAB_RESULT`);
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
