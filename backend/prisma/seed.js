import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tickets = [
  {
    title: 'Cannot access project dashboard',
    description: 'The dashboard loads a blank page after signing in with the demo account.',
    category: 'Access',
    priority: 'High',
    status: 'Open',
    ownerRole: 'User',
    ownerName: 'Demo User',
    votes: 4,
  },
  {
    title: 'Billing receipt has wrong company name',
    description: 'The receipt PDF shows an old company name and needs to be corrected.',
    category: 'Billing',
    priority: 'Medium',
    status: 'In Progress',
    ownerRole: 'User',
    ownerName: 'Demo User',
    votes: 2,
  },
  {
    title: 'Feature request for export filters',
    description: 'Agents need to export filtered ticket lists for weekly status reviews.',
    category: 'Feature',
    priority: 'Low',
    status: 'Resolved',
    ownerRole: 'Agent',
    ownerName: 'Support Agent',
    votes: 7,
  },
];

async function main() {
  const count = await prisma.ticket.count();
  if (count > 0) return;

  await prisma.ticket.createMany({ data: tickets });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
