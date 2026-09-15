import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env at project root
dotenv.config({ path: path.join(__dirname, '../.env') });

import { createApp } from './app';
import { connectDB } from './config/database';
import { seedData } from './seed/seeder';

const PORT = parseInt(process.env.PORT || '5173', 10);

const startServer = async () => {
  try {
    // 1. Connect MongoDB
    await connectDB();

    // 2. Run initial seeder check
    await seedData();

    // 3. Create Express App (with Vite Middleware Mode in Dev)
    const app = await createApp();

    // 4. Start listening on single port
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n  VITE v8.2.0 + EXPRESS (Middleware Mode)\n`);
      console.log(`  ➜  Local:   http://localhost:${PORT}/`);
      console.log(`  ➜  Network: http://127.0.0.1:${PORT}/`);
      console.log(`  ➜  API:     http://localhost:${PORT}/api/\n`);
      console.log(`  press h + enter to show help\n`);
    });
  } catch (error: any) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
