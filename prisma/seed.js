const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create companies
  const company1 = await prisma.company.create({
    data: {
      name: 'TechCorp Inc.',
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: 'StartupXYZ',
    },
  });

  console.log('✅ Companies created');

  // Create users
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Admin user for TechCorp
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@techcorp.com',
      password: hashedPassword,
      name: 'Admin TechCorp',
      role: UserRole.ADMIN,
      companyId: company1.id,
    },
  });

  // Regular user for TechCorp
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@techcorp.com',
      password: hashedPassword,
      name: 'John Doe',
      role: UserRole.USER,
      companyId: company1.id,
    },
  });

  // Admin user for StartupXYZ
  const adminUser2 = await prisma.user.create({
    data: {
      email: 'admin@startupxyz.com',
      password: hashedPassword,
      name: 'Admin StartupXYZ',
      role: UserRole.ADMIN,
      companyId: company2.id,
    },
  });

  // Regular user for StartupXYZ
  const user2 = await prisma.user.create({
    data: {
      email: 'user2@startupxyz.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: UserRole.USER,
      companyId: company2.id,
    },
  });

  console.log('✅ Users created');

  // Create some sample questions
  await prisma.question.create({
    data: {
      question: 'What is artificial intelligence?',
      answer: 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans.',
      userId: user1.id,
      companyId: company1.id,
    },
  });

  await prisma.question.create({
    data: {
      question: 'How does machine learning work?',
      answer: 'Machine learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed.',
      userId: user2.id,
      companyId: company2.id,
    },
  });

  console.log('✅ Sample questions created');
  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Test credentials:');
  console.log('TechCorp Admin: admin@techcorp.com / 123456');
  console.log('TechCorp User: user1@techcorp.com / 123456');
  console.log('StartupXYZ Admin: admin@startupxyz.com / 123456');
  console.log('StartupXYZ User: user2@startupxyz.com / 123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
