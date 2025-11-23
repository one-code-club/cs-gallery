import { prisma } from '../../src/lib/prisma';

async function globalSetup() {
  console.log('Cleaning up database...');
  try {
    // Delete in order of dependency
    await prisma.vote.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.user.deleteMany();
    console.log('Database cleaned.');
  } catch (error) {
    console.error('Error cleaning database:', error);
    throw error;
  }
}

export default globalSetup;

