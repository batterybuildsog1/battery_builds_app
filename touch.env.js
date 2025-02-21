require('dotenv').config();

console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('Reasoning Model:', process.env.GEMINI_REASONING_MODEL);
console.log('Vision Model:', process.env.GEMINI_VISION_MODEL);
