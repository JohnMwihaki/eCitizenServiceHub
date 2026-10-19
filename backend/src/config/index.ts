import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5600', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:4383@localhost:5432/ecitizen_hub?schema=public',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_ecitizen_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000').split(','),
  uploadDir: path.resolve(__dirname, '../../', process.env.UPLOAD_DIR || 'uploads'),
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  countyInfo: {
    name: process.env.COUNTY_NAME || 'Muranga County',
    email: process.env.COUNTY_EMAIL || 'services@muranga.go.ke',
    phone: process.env.COUNTY_PHONE || '+254 700 000 000',
    office: process.env.COUNTY_OFFICE || 'Muranga County Headquarters, P.O. Box 52-10200 Muranga',
  },
};
