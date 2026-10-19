import app from './app';
import { config } from './config';
import { prisma } from './lib/prisma';

const server = app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`  eCitizenHub API Server Running  `);
  console.log(`  Environment: ${config.env}              `);
  console.log(`  Port:        ${config.port}             `);
  console.log(`  County:      ${config.countyInfo.name}  `);
  console.log(`=========================================`);
});

const shutdown = async () => {
  console.log('Shutting down server gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Database disconnected. Process exited.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
