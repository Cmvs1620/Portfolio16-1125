import React, { useState } from 'react';

export default function SupabaseUploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return alert('Choose a file first');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Upload failed');
      onUploaded?.(json.url);
      alert('Uploaded: ' + json.url);
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <div>
        <button type="submit" disabled={loading} className="btn">
          {loading ? 'Uploading…' : 'Upload to Supabase'}
        </button>
      </div>
    </form>
  );
}
