import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const centers = [
    {
      generatedId: 'TTL-1001',
      name: 'City Diagnostic Center',
      password,
      latitude: 40.7128,
      longitude: -74.006,
      phoneNumber: '+1234567890',
      address: '123 Main St, NY',
      isVerified: true,
    },
    {
      generatedId: 'TTL-1002',
      name: 'Global Health Labs',
      password,
      latitude: 40.7306,
      longitude: -73.9352,
      phoneNumber: '+1987654321',
      address: '456 Broadway, NY',
      isVerified: false,
    },
    {
      generatedId: 'TTL-1003',
      name: 'Reliance Medical Care',
      password,
      latitude: 40.7589,
      longitude: -73.9851,
      phoneNumber: '+1122334455',
      address: '789 Times Sq, NY',
      isVerified: true,
    },
  ];

  for (const center of centers) {
    const createdCenter = await (prisma as any).diagnosticCenter.upsert({
      where: { generatedId: center.generatedId },
      update: {},
      create: center,
    });

    // Add some sample services for verified centers
    if (center.isVerified) {
      await (prisma as any).service.createMany({
        data: [
          { name: 'X-Ray', price: 500, centerId: createdCenter.id },
          { name: 'USG', price: 1200, centerId: createdCenter.id },
          { name: 'Blood Test', price: 300, centerId: createdCenter.id },
        ],
      });
    }
  }

  console.log('Seed completed: Added 3 centers with services.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
