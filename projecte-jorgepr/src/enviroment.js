//Sign up
export {APIKEY_anon_public, singUpUrl, loginUrl, updateUrl};

const APIKEY_anon_public = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdW1mYmtrdHB0c2p6cnFwdXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzIwNjcsImV4cCI6MjA3NjEwODA2N30.HdMHNGHMstIYAfcSCe6m92smO5CyEtw9iLNmabrCZeI';

const singUpUrl = 'https://psumfbkktptsjzrqpuus.supabase.co/auth/v1/signup';
const loginUrl = 'https://psumfbkktptsjzrqpuus.supabase.co/auth/v1/token?grant_type=password';
const updateUrl = 'https://psumfbkktptsjzrqpuus.supabase.co/rest/v1/profiles?';

// curl -X POST 'https://psumfbkktptsjzrqpuus.supabase.co/auth/v1/signup' \
// -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdW1mYmtrdHB0c2p6cnFwdXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzIwNjcsImV4cCI6MjA3NjEwODA2N30.HdMHNGHMstIYAfcSCe6m92smO5CyEtw9iLNmabrCZeI" \
// -H "Content-Type: application/json" \
// -d '{
//   "email": "someone@email.com",
//   "password": "cwSpYSDMKfGouJtFdiol"
// }'
