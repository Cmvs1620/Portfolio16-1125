import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';

// Vercel serverless function: accepts multipart/form-data with a file field
// and uploads it to the configured Supabase Storage bucket using the
// Service Role key (server-side secret). Returns a public URL.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error', err);
      return res.status(500).json({ error: 'Could not parse form' });
    }

    const file = files?.file || files?.image;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const buffer = fs.readFileSync(file.filepath || file.path);

      const SUPABASE_URL = process.env.SUPABASE_URL;
      const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const BUCKET = process.env.SUPABASE_BUCKET || 'Portfolio test';

      if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        return res.status(500).json({ error: 'Supabase credentials not configured' });
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      });

      const id = crypto.randomUUID?.() || Date.now().toString(36);
      const key = `projects/${id}-${file.originalFilename || file.name}`;

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(key, buffer, { contentType: file.mimetype || 'application/octet-stream' });

      if (error) {
        console.error('Supabase upload error', error);
        return res.status(500).json({ error: error.message || error });
      }

      const base = SUPABASE_URL.replace(/\/$/, '');
      const publicUrl = `${base}/storage/v1/object/public/${data.path}`;

      return res.status(200).json({ url: publicUrl, path: data.path });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Upload failed' });
    }
  });
}
