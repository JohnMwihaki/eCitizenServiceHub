import { prisma } from '../lib/prisma';

export async function generateReferenceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `CSR-${currentYear}-`;

  // Find the highest existing reference number for the current year
  const latestRequest = await prisma.serviceRequest.findFirst({
    where: {
      referenceNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      referenceNumber: true,
    },
  });

  let nextSequence = 1;
  if (latestRequest?.referenceNumber) {
    const parts = latestRequest.referenceNumber.split('-');
    if (parts.length === 3) {
      const parsed = parseInt(parts[2], 10);
      if (!isNaN(parsed)) {
        nextSequence = parsed + 1;
      }
    }
  }

  // Ensure uniqueness in case of race conditions
  let attempts = 0;
  while (attempts < 10) {
    const candidate = `${prefix}${String(nextSequence).padStart(4, '0')}`;
    const existing = await prisma.serviceRequest.findUnique({
      where: { referenceNumber: candidate },
      select: { id: true },
    });
    if (!existing) {
      return candidate;
    }
    nextSequence++;
    attempts++;
  }

  // Fallback 
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomSuffix}`;
}
