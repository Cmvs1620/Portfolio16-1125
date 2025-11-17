import { createClient } from '@supabase/supabase-js';

// Put the anon key in an env var for client builds:
// VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Upload a File (browser File or Blob) to a Supabase Storage bucket and
// return a publicly reachable URL. Use this from your client-side form
// submit handler. Make sure the bucket is public or you generate signed URLs.
export async function uploadImage(file, bucket = 'public') {
  if (!file) throw new Error('No file provided');
  const id = crypto.randomUUID();
  const filePath = `products/${id}-${file.name}`;

  // In the browser you can pass the File directly
  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  // Construct public URL for the uploaded object. This works for public
  // buckets. If you need private access, use signed URLs on the server.
  const base = String(import.meta.env.VITE_SUPABASE_URL).replace(/\/$/, '');
  const publicUrl = `${base}/storage/v1/object/public/${data.path}`;
  return publicUrl;
}