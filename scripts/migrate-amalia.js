// scripts/migrate-amalia.js
// Copy an existing Supabase-hosted image to the desired folder/key in the same bucket.
// Usage:
// SUPABASE_URL="https://..." SUPABASE_SERVICE_ROLE_KEY="..." node scripts/migrate-amalia.js

import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const SRC_URL = 'https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/amalia.png';
const BUCKET = process.env.SUPABASE_BUCKET || 'Portfolio test';
const TARGET_KEY = 'Givenchy/amalia.png';

async function main() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.');
    process.exit(1);
  }

  console.log('Downloading source image:', SRC_URL);
  const resp = await fetch(SRC_URL);
  if (!resp.ok) {
    console.error('Failed to download source image:', resp.status, resp.statusText);
    process.exit(1);
  }
  const ab = await resp.arrayBuffer();
  const buffer = Buffer.from(ab);

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log('Uploading to bucket:', BUCKET, 'key:', TARGET_KEY);
  const { data, error } = await supabase.storage.from(BUCKET).upload(TARGET_KEY, buffer, {
    contentType: 'image/png',
    upsert: true,
  });

  if (error) {
    console.error('Upload error:', error);
    process.exit(1);
  }

  const publicUrl = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${data.path}`;
  console.log('Uploaded. Public URL:', publicUrl);
}

main().catch((err) => { console.error(err); process.exit(1); });
