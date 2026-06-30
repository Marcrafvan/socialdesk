// Dummy credentials so modules that construct clients at require-time
// (e.g. supabaseClient.js) don't throw when no real .env is present.
// dotenv.config() never overwrites a value already set on process.env,
// so these stick even if backend/.env defines the real ones.
process.env.JWT_SECRET ||= "test-jwt-secret";
process.env.SUPABASE_URL ||= "http://localhost:54321";
process.env.SUPABASE_KEY ||= "test-anon-key";
