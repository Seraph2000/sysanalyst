// Server-only — do not import from client components
import { DirectoryEntry } from './types';

const FOLDER_MIME = 'application/vnd.google-apps.folder';
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const MAX_DEPTH = 3;
const MAX_FOLDERS = 40;

interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
}

async function listDriveItems(accessToken: string, parentId: string): Promise<DriveItem[]> {
  const params = new URLSearchParams({
    q: `'${parentId}' in parents and trashed=false`,
    fields: 'files(id,name,mimeType)',
    pageSize: '200',
    orderBy: 'folder,name',
  });

  const res = await fetch(`${DRIVE_API}/files?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Drive API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  return data.files ?? [];
}

async function buildTree(
  accessToken: string,
  parentId: string,
  depth: number,
  folderCount: { value: number }
): Promise<DirectoryEntry[]> {
  if (depth > MAX_DEPTH || folderCount.value >= MAX_FOLDERS) return [];

  const items = await listDriveItems(accessToken, parentId);
  const entries: DirectoryEntry[] = [];

  for (const item of items) {
    if (item.mimeType === FOLDER_MIME) {
      folderCount.value++;
      const children = await buildTree(accessToken, item.id, depth + 1, folderCount);
      entries.push({ name: item.name, type: 'directory', children });
    } else {
      entries.push({ name: item.name, type: 'file' });
    }
  }

  return entries.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });
}

export async function fetchDriveTree(accessToken: string): Promise<DirectoryEntry[]> {
  return buildTree(accessToken, 'root', 0, { value: 0 });
}

export async function refreshGoogleToken(
  refreshToken: string
): Promise<{ access_token: string; expires_in: number }> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to refresh Google token. Please reconnect Google Drive.');
  }

  return res.json();
}
