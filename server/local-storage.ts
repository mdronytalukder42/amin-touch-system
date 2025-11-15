import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  await ensureUploadDir();
  
  const key = relKey.replace(/^\/+/, "");
  const filePath = join(UPLOAD_DIR, key);
  
  // Ensure subdirectories exist
  const dir = join(UPLOAD_DIR, key.split('/').slice(0, -1).join('/'));
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  
  // Write file
  const buffer = typeof data === 'string' ? Buffer.from(data) : Buffer.from(data);
  await writeFile(filePath, buffer);
  
  // Return public URL
  const url = `/uploads/${key}`;
  
  return { key, url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string; }> {
  const key = relKey.replace(/^\/+/, "");
  const url = `/uploads/${key}`;
  
  return { key, url };
}
