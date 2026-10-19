import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Initializing eCitizenServiceHub Database ---');

  // Prebuild Administrator Account
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@muranga.go.ke';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      isActive: true,
    },
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      fullName: 'County Administrator',
      phone: '+254 700 000 000',
      nationalId: 'ADM-00100',
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log(`[OK] Administrator account prebuilt: ${admin.email}`);

  // Prebuild Official County Service Categories
  const categories = [
    {
      code: 'ROADS',
      name: 'Roads & Transport',
      description: 'Pothole repairs, road signage, traffic signals, sidewalk maintenance and roadway safety hazards.',
      icon: 'Road',
      isActive: true,
    },
    {
      code: 'WATER',
      name: 'Water & Sanitation',
      description: 'Clean water supply, pipe bursts, meter issues, sewage leaks and water rationing inquiries.',
      icon: 'WaterDrop',
      isActive: true,
    },
    {
      code: 'DRAINAGE',
      name: 'Drainage & Stormwater',
      description: 'Culvert clearing, blocked stormwater drainage trenches, erosion and flash flood mitigation.',
      icon: 'Waves',
      isActive: true,
    },
    {
      code: 'WASTE',
      name: 'Waste Management',
      description: 'Solid waste collection, illegal trash dumping sites, public trash cans and recycling depots.',
      icon: 'Delete',
      isActive: true,
    },
    {
      code: 'HEALTH',
      name: 'Public Health & Environment',
      description: 'Pest vector control, food hygiene inspections, environmental pollution and clinic sanitation.',
      icon: 'LocalHospital',
      isActive: true,
    },
    {
      code: 'LIGHTING',
      name: 'Street Lighting & Power',
      description: 'Non-functional street lamps, high mast floodlights, broken poles and exposed wiring in public spaces.',
      icon: 'Lightbulb',
      isActive: true,
    },
    {
      code: 'PARKS',
      name: 'Parks & Public Amenities',
      description: 'County park maintenance, dangerous overgrown trees, damaged community playgrounds and recreational facilities.',
      icon: 'Park',
      isActive: true,
    },
    {
      code: 'LICENSING',
      name: 'County Licensing & Permits',
      description: 'Single business permits, outdoor advertising clearances, building approvals and liquor licensing inspections.',
      icon: 'Assignment',
      isActive: true,
    },
  ];

  for (const cat of categories) {
    await prisma.serviceCategory.upsert({
      where: { code: cat.code },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        isActive: cat.isActive,
      },
      create: cat,
    });
  }

  console.log(`[OK] ${categories.length} service categories prebuilt.`);
  console.log('--- Database Initialization Complete (Zero Mock Requests Created) ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
