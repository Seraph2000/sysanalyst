// Guardrail: hide the names of files and folders that look like they hold
// credentials or secrets. The app never reads file contents, but names alone
// can reveal what a folder holds (and some, like client_secret_<id>.json,
// embed identifiers), and every name we keep is shown on screen, sent to the
// AI provider and saved with the analysis.
//
// Safe to import from both client and server code.

import { DirectoryEntry } from './types';

// Templates are meant to be shared and hold no real values.
const TEMPLATE_SUFFIX = /\.(example|sample|template|dist|tmpl)$/i;

// Always sensitive, whatever the context.
const STRONG_PATTERNS: RegExp[] = [
  /^\.env(\..+)?$/i,                       // .env, .env.local, .env.production
  /\.env$/i,                               // prod.env
  /^\.?(npmrc|pypirc|netrc|htpasswd|pgpass|git-credentials|dockercfg|s3cfg|boto)$/i,
  /\.(pem|key|p8|p12|pfx|jks|keystore|ppk|kdbx?|ovpn)$/i, // keys, keystores, password DBs, VPN profiles
  /^id_(rsa|dsa|ecdsa|ed25519)(\.pub)?$/i, // SSH keys
  /^(authorized_keys|known_hosts)$/i,
  /\.tfstate(\.backup)?$/i,                // Terraform state embeds secrets
  /\.tfvars(\.json)?$/i,
  /client[_ -]?secret/i,                   // Google OAuth client_secret_<id>.json
  /service[_ -]?account.*\.json$/i,
  /^secrets?\.(py|js|ts|json|ya?ml|toml|ini|cfg|conf)$/i,
  /wallet\.dat$/i,
];

// Words that suggest secrets in a document or data file name.
const WORD_PATTERNS: RegExp[] = [
  /credential/i,
  /secret/i,
  /passw(or)?d/i,
  /api[_ -]?keys?\b/i,
  /(access|auth|refresh|bearer)[_ -]?tokens?/i,
  /private[_ -]?key/i,
  /recovery[_ -]?(codes?|phrase|key)/i,
  /seed[_ -]?phrase/i,
];

// Source and markup files named after these words are normally app code
// (ForgotPassword.tsx, auth-token.ts), not secrets, so the word patterns
// don't apply to them. Strong patterns still do.
const CODE_EXTENSIONS =
  /\.(ts|tsx|js|jsx|mjs|cjs|py|rb|go|rs|java|kt|cs|php|swift|vue|svelte|css|scss|html|md|mdx|sql|test\.\w+|spec\.\w+)$/i;

// Folder names that on their own say "secrets live here". Exact matches only,
// so app folders like reset-password/ or auth/ are left alone.
const SENSITIVE_FOLDER =
  /^\.?(secrets?|credentials?|creds|passwords?|keys|private[_ -]?keys?|api[_ -]?keys?|tokens?|certs?|certificates|ssh|\.ssh|gnupg|\.gnupg)$/i;

export const HIDDEN_FILE_LABEL = '[sensitive file — name hidden]';
export const HIDDEN_FOLDER_LABEL = '[sensitive folder — name hidden]';

export function isSensitiveName(name: string, isDirectory = false): boolean {
  if (TEMPLATE_SUFFIX.test(name)) return false;
  if (isDirectory) return SENSITIVE_FOLDER.test(name);
  if (STRONG_PATTERNS.some((p) => p.test(name))) return true;
  if (CODE_EXTENSIONS.test(name)) return false;
  return WORD_PATTERNS.some((p) => p.test(name));
}

/**
 * Returns a copy of the tree with sensitive names replaced by a placeholder.
 * Sensitive folders are emptied. The placeholder is kept (rather than
 * dropping the entry) so the analysis can still flag that credentials are
 * sitting in the project.
 */
export function redactSensitiveEntries(entries: DirectoryEntry[]): DirectoryEntry[] {
  return entries.map((entry) => {
    const isDir = entry.type === 'directory';
    if (isSensitiveName(entry.name, isDir)) {
      return isDir
        ? { name: HIDDEN_FOLDER_LABEL, type: 'directory', children: [] }
        : { name: HIDDEN_FILE_LABEL, type: 'file' };
    }
    if (isDir) {
      return { ...entry, children: redactSensitiveEntries(entry.children ?? []) };
    }
    return entry;
  });
}
