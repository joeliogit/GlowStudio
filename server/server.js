require('dotenv').config();
const app = require('./src/app');
const { PORT } = require('./src/config/env');

// Import cron job (starts automatically when required)
require('./src/jobs/appointmentReminder');

app.listen(PORT, () => {
  console.log(`\n  GlowStudio API running on port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV}`);
  console.log(`  Docs: http://localhost:${PORT}/api/health\n`);
});
